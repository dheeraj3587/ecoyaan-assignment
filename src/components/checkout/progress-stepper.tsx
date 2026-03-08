"use client";

import { usePathname } from "next/navigation";
import { ShoppingCart, MapPin, CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    { path: "/", label: "Cart", icon: ShoppingCart },
    { path: "/shipping", label: "Shipping", icon: MapPin },
    { path: "/payment", label: "Payment", icon: CreditCard },
];

const stepOrder = ["/", "/shipping", "/payment", "/success"];

export function ProgressStepper() {
    const pathname = usePathname();
    const currentIndex = stepOrder.indexOf(pathname);

    return (
        <div className="mx-auto mb-8 flex max-w-md items-center justify-between">
            {steps.map((step, i) => {
                const isCompleted = currentIndex > i;
                const isActive = currentIndex === i;
                const Icon = step.icon;

                return (
                    <div key={step.path} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-[border-color,background-color,color,transform] duration-300",
                                    isCompleted &&
                                    "border-emerald-600 bg-emerald-600 text-white",
                                    isActive &&
                                    "border-emerald-600 bg-emerald-50 text-emerald-600 scale-110",
                                    !isCompleted &&
                                    !isActive &&
                                    "border-muted-foreground/30 text-muted-foreground/50"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <Icon className="h-5 w-5" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium transition-colors",
                                    isActive && "text-emerald-600",
                                    isCompleted && "text-emerald-600",
                                    !isActive && !isCompleted && "text-muted-foreground/60"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>

                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    "mx-3 h-0.5 w-12 rounded-full transition-colors duration-300 sm:w-20",
                                    currentIndex > i ? "bg-emerald-600" : "bg-muted-foreground/20"
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
