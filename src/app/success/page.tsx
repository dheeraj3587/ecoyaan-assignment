"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, Leaf, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { generateOrderId } from "@/lib/utils";
import { useCheckout } from "@/context/checkout-context";

export default function SuccessPage() {
    const { dispatch } = useCheckout();
    const [orderId, setOrderId] = useState("");
    const [stage, setStage] = useState(0);

    useEffect(() => {
        // Clear checkout state now that we're safely on the success page
        try { localStorage.removeItem("ecoyaan-checkout"); } catch { /* ignore */ }
        dispatch({ type: "CLEAR_STATE" });

        setOrderId(generateOrderId());
        const t1 = setTimeout(() => setStage(1), 100);
        const t2 = setTimeout(() => setStage(2), 600);
        const t3 = setTimeout(() => setStage(3), 1100);
        const t4 = setTimeout(() => setStage(4), 1600);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [dispatch]);

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-lg text-center">

                {/* animated checkmark circle */}
                <div
                    className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-700 ease-out ${stage >= 1
                            ? "scale-100 opacity-100 bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.35)]"
                            : "scale-50 opacity-0 bg-emerald-300"
                        }`}
                >
                    <svg
                        className={`h-12 w-12 text-white transition-all duration-500 delay-200 ${stage >= 1 ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M5 13l4 4L19 7"
                            className="animate-draw-check"
                            style={{
                                strokeDasharray: 24,
                                strokeDashoffset: stage >= 1 ? 0 : 24,
                                transition: "stroke-dashoffset 0.6s ease-out 0.3s",
                            }}
                        />
                    </svg>
                </div>

                {/* title */}
                <div
                    className={`transition-all duration-500 ${stage >= 2
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                        }`}
                >
                    <h1 className="mb-1 text-3xl font-bold tracking-tight">
                        Payment Successful!
                    </h1>
                    <p className="text-muted-foreground">
                        Your eco-friendly order has been placed
                    </p>
                </div>

                {/* order details card */}
                <div
                    className={`mt-8 transition-all duration-500 ${stage >= 3
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                >
                    <Card className="overflow-hidden border-emerald-100 shadow-lg shadow-emerald-50">
                        <div className="h-1 bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-500" />
                        <CardContent className="space-y-4 pt-6">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                                <Shield className="h-6 w-6 text-emerald-600" />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Order ID</span>
                                <span className="font-mono text-sm font-bold tracking-wide">
                                    {orderId}
                                </span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Truck className="h-4 w-4" />
                                    Estimated Delivery
                                </span>
                                <span className="text-sm font-semibold">3–5 business days</span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Package className="h-4 w-4" />
                                    Packaging
                                </span>
                                <span className="text-sm font-semibold text-emerald-600">
                                    100% Plastic-Free
                                </span>
                            </div>

                            <Separator />

                            <div className="rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 p-4">
                                <p className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
                                    <Leaf className="h-4 w-4" />
                                    Your order saved <strong className="mx-0.5">1.2 kg</strong> of
                                    plastic waste!
                                </p>
                                <p className="mt-1 text-xs text-emerald-600/70">
                                    1% of this transaction goes towards planting trees 🌱
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA */}
                <div
                    className={`mt-8 transition-all duration-500 ${stage >= 4
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                        }`}
                >
                    <Link href="/">
                        <Button
                            size="lg"
                            className="bg-emerald-600 px-8 text-white transition-[transform,background-color] duration-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
                            aria-label="Continue shopping"
                        >
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                    <p className="mt-4 text-xs text-muted-foreground">
                        A confirmation email has been sent to your inbox
                    </p>
                </div>
            </div>
        </div>
    );
}
