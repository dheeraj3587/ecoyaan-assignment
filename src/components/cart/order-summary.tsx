"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Leaf, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useCheckout } from "@/context/checkout-context";
import { formatCurrency } from "@/lib/utils";

export function OrderSummary() {
    const router = useRouter();
    const { state, subtotal, grandTotal, itemCount } = useCheckout();
    const { shipping_fee, discount_applied } = state.cart;

    const isEmpty = itemCount === 0;

    return (
        <div className="space-y-4">
            <Card className="sticky top-24">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                        </span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Truck className="h-3.5 w-3.5" />
                            Shipping
                        </span>
                        <span className="font-medium">{formatCurrency(shipping_fee)}</span>
                    </div>

                    {discount_applied > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(discount_applied)}</span>
                        </div>
                    )}

                    <Separator />

                    <div className="flex justify-between">
                        <span className="text-base font-bold">Grand Total</span>
                        <span className="text-lg font-bold text-emerald-600">
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>

                    <Button
                        className="mt-2 w-full bg-emerald-600 text-white transition-[transform,background-color] duration-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
                        size="lg"
                        disabled={isEmpty}
                        onClick={() => router.push("/shipping")}
                        aria-label="Proceed to checkout"
                    >
                        Proceed to Checkout
                    </Button>

                    <div className="flex items-center justify-center gap-1.5 pt-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            Secure checkout
                        </span>
                        <Badge variant="outline" className="ml-1 text-[10px]">
                            SSL
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-sm">
                    Your order saves approximately <strong>1.2 kg</strong> of plastic waste.
                    Thank you for choosing eco-friendly products!
                </AlertDescription>
            </Alert>
        </div>
    );
}
