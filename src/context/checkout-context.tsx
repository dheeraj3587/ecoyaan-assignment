"use client";

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import type { CartData, CartItem, ShippingAddress } from "@/lib/types";
import { isValidCartData, isValidShippingAddress } from "@/lib/utils";

interface CheckoutState {
    cart: CartData;
    shippingAddress: ShippingAddress | null;
}

type CheckoutAction =
    | { type: "SET_CART"; payload: CartData }
    | { type: "UPDATE_QUANTITY"; payload: { productId: number; delta: number } }
    | { type: "REMOVE_ITEM"; payload: { productId: number } }
    | { type: "SET_ADDRESS"; payload: ShippingAddress }
    | { type: "CLEAR_STATE" }
    | { type: "HYDRATE_FROM_STORAGE"; payload: Partial<CheckoutState> };

const initialState: CheckoutState = {
    cart: { cartItems: [], shipping_fee: 0, discount_applied: 0 },
    shippingAddress: null,
};

function checkoutReducer(
    state: CheckoutState,
    action: CheckoutAction
): CheckoutState {
    switch (action.type) {
        case "HYDRATE_FROM_STORAGE":
            return {
                cart: action.payload.cart ?? state.cart,
                shippingAddress: action.payload.shippingAddress ?? state.shippingAddress,
            };

        case "SET_CART":
            return { ...state, cart: action.payload };

        case "UPDATE_QUANTITY": {
            const updated = state.cart.cartItems
                .map((item) =>
                    item.product_id === action.payload.productId
                        ? { ...item, quantity: Math.max(0, item.quantity + action.payload.delta) }
                        : item
                )
                .filter((item) => item.quantity > 0);

            return {
                ...state,
                cart: { ...state.cart, cartItems: updated },
            };
        }

        case "REMOVE_ITEM": {
            const filtered = state.cart.cartItems.filter(
                (item) => item.product_id !== action.payload.productId
            );
            return {
                ...state,
                cart: { ...state.cart, cartItems: filtered },
            };
        }

        case "SET_ADDRESS":
            return { ...state, shippingAddress: action.payload };

        case "CLEAR_STATE":
            return initialState;

        default:
            return state;
    }
}

interface CheckoutContextValue {
    state: CheckoutState;
    dispatch: React.Dispatch<CheckoutAction>;
    subtotal: number;
    grandTotal: number;
    itemCount: number;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

const STORAGE_KEY = "ecoyaan-checkout";

/** Safely read from localStorage with validation */
function readPersistedState(): Partial<CheckoutState> | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed !== "object" || parsed === null) return null;

        const result: Partial<CheckoutState> = {};

        if (parsed.cart && isValidCartData(parsed.cart)) {
            result.cart = parsed.cart as CartData;
        }
        if (parsed.shippingAddress && isValidShippingAddress(parsed.shippingAddress)) {
            result.shippingAddress = parsed.shippingAddress as ShippingAddress;
        }

        return Object.keys(result).length > 0 ? result : null;
    } catch {
        return null;
    }
}

/** Safely write to localStorage */
function persistState(state: CheckoutState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Silently fail — localStorage may be full or restricted (incognito, etc.)
    }
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(checkoutReducer, initialState);

    // Hydrate from localStorage AFTER mount to avoid SSR mismatch
    useEffect(() => {
        const persisted = readPersistedState();
        if (persisted) {
            dispatch({ type: "HYDRATE_FROM_STORAGE", payload: persisted });
        }
    }, []);

    // Persist to localStorage on every change (skip initial empty state)
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => { setHydrated(true); }, []);
    useEffect(() => {
        if (hydrated) {
            persistState(state);
        }
    }, [state, hydrated]);

    const subtotal = state.cart.cartItems.reduce(
        (sum, item) => sum + item.product_price * item.quantity,
        0
    );

    // Clamp grand total to prevent negative values
    const grandTotal = Math.max(
        0,
        subtotal + state.cart.shipping_fee - state.cart.discount_applied
    );

    const itemCount = state.cart.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <CheckoutContext.Provider
            value={{ state, dispatch, subtotal, grandTotal, itemCount }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const ctx = useContext(CheckoutContext);
    if (!ctx) {
        throw new Error("useCheckout must be used within CheckoutProvider");
    }
    return ctx;
}
