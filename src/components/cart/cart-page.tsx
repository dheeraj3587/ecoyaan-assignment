"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/context/checkout-context";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { OrderSummary } from "@/components/cart/order-summary";
import { ProgressStepper } from "@/components/checkout/progress-stepper";
import { formatCurrency } from "@/lib/utils";
import type { CartData } from "@/lib/types";

interface CartPageProps {
    initialData: CartData;
}

export function CartPage({ initialData }: CartPageProps) {
    const router = useRouter();
    const { state, dispatch, itemCount, grandTotal } = useCheckout();
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
            <div className="flex flex-col items-center justify-center py-20 text-center animate-slide-up">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50">
                    <ShoppingBag className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
                <p className="mb-6 max-w-xs text-muted-foreground">
                    Looks like you haven&apos;t added any eco-friendly products yet.
                </p>
                <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200"
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
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
                <div className="space-y-3 sm:space-y-4">
                    <h1 className="text-xl font-bold sm:text-2xl animate-slide-up">Shopping Cart</h1>
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

            {/* Mobile sticky bottom bar */}
            <div className="sticky-bottom-bar sm:hidden">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(grandTotal)}</p>
                    </div>
                    <Button
                        className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 px-6"
                        size="lg"
                        disabled={isEmpty}
                        onClick={() => router.push("/shipping")}
                        aria-label="Proceed to checkout"
                    >
                        Checkout
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
