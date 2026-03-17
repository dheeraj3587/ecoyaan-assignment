"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/context/checkout-context";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

interface CartItemCardProps {
    item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
    const { dispatch } = useCheckout();

    return (
        <Card className="group overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-50 animate-scale-in">
            <CardContent className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28">
                    <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        sizes="(max-width: 640px) 80px, 112px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-semibold leading-tight text-sm sm:text-base truncate">
                                {item.product_name}
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                                {formatCurrency(item.product_price)} each
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                dispatch({
                                    type: "REMOVE_ITEM",
                                    payload: { productId: item.product_id },
                                })
                            }
                            className="h-7 w-7 shrink-0 text-muted-foreground transition-colors duration-200 sm:opacity-0 sm:group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 focus-visible:opacity-100"
                            aria-label={`Remove ${item.product_name} from cart`}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div
                            className="flex items-center gap-0.5 rounded-full border border-border/80 bg-muted/50"
                            role="group"
                            aria-label={`Quantity controls for ${item.product_name}`}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                                onClick={() =>
                                    dispatch({
                                        type: "UPDATE_QUANTITY",
                                        payload: { productId: item.product_id, delta: -1 },
                                    })
                                }
                                aria-label={`Decrease quantity of ${item.product_name}`}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span
                                className="w-7 text-center text-xs font-bold sm:w-8 sm:text-sm"
                                aria-label={`Quantity: ${item.quantity}`}
                            >
                                {item.quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                                onClick={() =>
                                    dispatch({
                                        type: "UPDATE_QUANTITY",
                                        payload: { productId: item.product_id, delta: 1 },
                                    })
                                }
                                aria-label={`Increase quantity of ${item.product_name}`}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <p className="text-sm font-bold sm:text-base text-emerald-700">
                            {formatCurrency(item.product_price * item.quantity)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
