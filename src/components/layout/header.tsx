"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCheckout } from "@/context/checkout-context";

export function Header() {
    const pathname = usePathname();
    const { itemCount } = useCheckout();

    const isSuccess = pathname === "/success";

    return (
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                    aria-label="Ecoyaan home"
                >
                    <Image
                        src="https://prod-cdn.ecoyaan.com/pb-cs-app/images/ecoyaan-favicon.ico"
                        alt="Ecoyaan logo"
                        width={32}
                        height={32}
                        className="rounded-lg sm:h-9 sm:w-9"
                        unoptimized
                    />
                    <span className="text-lg font-bold tracking-tight sm:text-xl">Ecoyaan</span>
                </Link>

                {!isSuccess && (
                    <Link
                        href="/"
                        className="relative flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                        aria-label={`Shopping cart with ${itemCount} items`}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 p-0 text-[10px] text-white">
                                {itemCount}
                            </Badge>
                        )}
                    </Link>
                )}
            </div>
        </header>
    );
}
