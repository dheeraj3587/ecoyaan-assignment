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
        <Card className="group overflow-hidden transition-shadow duration-200 hover:shadow-md">
            <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-28 sm:w-28">
                    <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-semibold leading-tight">{item.product_name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
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
                            className="h-8 w-8 text-muted-foreground transition-colors duration-200 sm:opacity-0 sm:group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100"
                            aria-label={`Remove ${item.product_name} from cart`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-border" role="group" aria-label={`Quantity controls for ${item.product_name}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
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
                            <span className="w-8 text-center text-sm font-medium" aria-label={`Quantity: ${item.quantity}`}>
                                {item.quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
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
                        <p className="text-base font-bold">
                            {formatCurrency(item.product_price * item.quantity)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
