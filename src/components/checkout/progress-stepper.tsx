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
        <div className="mx-auto mb-6 flex max-w-sm items-center justify-between sm:mb-8 sm:max-w-md animate-fade-in">
            {steps.map((step, i) => {
                const isCompleted = currentIndex > i;
                const isActive = currentIndex === i;
                const Icon = step.icon;

                return (
                    <div key={step.path} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-10 sm:w-10",
                                    isCompleted &&
                                    "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-200",
                                    isActive &&
                                    "border-emerald-600 bg-emerald-50 text-emerald-600 scale-110 shadow-md shadow-emerald-100",
                                    !isCompleted &&
                                    !isActive &&
                                    "border-muted-foreground/25 text-muted-foreground/40"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-semibold tracking-wide uppercase transition-colors sm:text-xs",
                                    isActive && "text-emerald-600",
                                    isCompleted && "text-emerald-600",
                                    !isActive && !isCompleted && "text-muted-foreground/50"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>

                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    "mx-2 h-0.5 w-8 rounded-full transition-all duration-500 sm:mx-3 sm:w-16",
                                    currentIndex > i ? "bg-emerald-500" : "bg-muted-foreground/15"
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
