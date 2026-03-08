"use client";

import { useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/context/checkout-context";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { OrderSummary } from "@/components/cart/order-summary";
import { ProgressStepper } from "@/components/checkout/progress-stepper";
import type { CartData } from "@/lib/types";

interface CartPageProps {
    initialData: CartData;
}

export function CartPage({ initialData }: CartPageProps) {
    const { state, dispatch, itemCount } = useCheckout();
    const hasHydrated = useRef(false);

    useEffect(() => {
        if (!hasHydrated.current && state.cart.cartItems.length === 0) {
            dispatch({ type: "SET_CART", payload: initialData });
        }
        hasHydrated.current = true;
    }, [dispatch, initialData, state.cart.cartItems.length]);

    const isEmpty = state.cart.cartItems.length === 0;

    if (isEmpty) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
                <p className="mb-6 text-muted-foreground">
                    Looks like you haven&apos;t added any eco-friendly products yet.
                </p>
                <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => dispatch({ type: "SET_CART", payload: initialData })}
                    aria-label="Continue shopping"
                >
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <div>
            <ProgressStepper />
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">Shopping Cart</h1>
                    {/* Live region for screen readers to announce cart changes */}
                    <div className="sr-only" aria-live="polite" aria-atomic="true">
                        {itemCount} {itemCount === 1 ? "item" : "items"} in cart
                    </div>
                    {state.cart.cartItems.map((item) => (
                        <CartItemCard key={item.product_id} item={item} />
                    ))}
                </div>
                <aside>
                    <OrderSummary />
                </aside>
            </div>
        </div>
    );
}
