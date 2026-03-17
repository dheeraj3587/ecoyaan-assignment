"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    MapPin,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Plus,
    Check,
    Trash2,
    Home,
} from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ProgressStepper } from "@/components/checkout/progress-stepper";
import { useCheckout } from "@/context/checkout-context";
import { formatCurrency, generateAddressId } from "@/lib/utils";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const shippingSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    addressLine: z.string().min(5, "Please enter your full address"),
    pinCode: z
        .string()
        .regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(1, "Please select a state"),
    saveAddress: z.boolean(),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export function ShippingPage() {
    const router = useRouter();
    const { state, dispatch, subtotal, grandTotal, itemCount } = useCheckout();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const { savedAddresses, selectedAddressId } = state;
    const hasSavedAddresses = savedAddresses.length > 0;

    // Show form by default when there are no saved addresses
    useEffect(() => {
        if (!hasSavedAddresses) {
            setShowForm(true);
        }
    }, [hasSavedAddresses]);

    const form = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            addressLine: "",
            pinCode: "",
            city: "",
            state: "",
            saveAddress: true,
        },
    });

    // Redirect to cart if cart is empty
    useEffect(() => {
        if (itemCount === 0) {
            router.replace("/");
        }
    }, [itemCount, router]);

    function onSubmit(values: ShippingFormValues) {
        setIsSubmitting(true);
        const address = {
            ...values,
            id: generateAddressId(),
        };
        dispatch({ type: "ADD_ADDRESS", payload: address });
        setShowForm(false);
        setIsSubmitting(false);
        // Navigate directly after saving
        router.push("/payment");
    }

    function handleContinue() {
        if (showForm) {
            // Trigger form validation + submission (onSubmit handles navigation)
            formRef.current?.requestSubmit();
            return;
        }
        if (!selectedAddressId) return;
        const selected = savedAddresses.find((a) => a.id === selectedAddressId);
        if (selected) {
            dispatch({ type: "SET_ADDRESS", payload: selected });
            router.push("/payment");
        }
    }

    if (itemCount === 0) {
        return null;
    }

    return (
        <div>
            <ProgressStepper />

            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
                <div className="space-y-4 animate-slide-up">
                    <h1 className="text-xl font-bold sm:text-2xl">Shipping Address</h1>

                    {/* Saved Addresses */}
                    {hasSavedAddresses && (
                        <div className="space-y-2.5">
                            <p className="text-sm font-medium text-muted-foreground">
                                Your saved addresses
                            </p>
                            {savedAddresses.map((addr) => {
                                const isSelected = selectedAddressId === addr.id;
                                return (
                                    <Card
                                        key={addr.id}
                                        className={`cursor-pointer transition-all duration-200 ${isSelected
                                            ? "border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100 ring-1 ring-emerald-500/20"
                                            : "border-border/60 hover:border-emerald-300 hover:shadow-sm"
                                            }`}
                                        onClick={() => {
                                            dispatch({ type: "SELECT_ADDRESS", payload: { id: addr.id } });
                                            setShowForm(false);
                                        }}
                                    >
                                        <CardContent className="flex items-start gap-3 p-3 sm:p-4">
                                            <div
                                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isSelected
                                                    ? "border-emerald-600 bg-emerald-600"
                                                    : "border-muted-foreground/30"
                                                    }`}
                                            >
                                                {isSelected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Home className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <p className="text-sm font-semibold truncate">
                                                        {addr.fullName}
                                                    </p>
                                                </div>
                                                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                                                    {addr.addressLine}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {addr.city}, {addr.state} — {addr.pinCode}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    +91 {addr.phone}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch({ type: "REMOVE_ADDRESS", payload: { id: addr.id } });
                                                }}
                                                aria-label={`Remove address for ${addr.fullName}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {!showForm && (
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400"
                                    onClick={() => {
                                        setShowForm(true);
                                        form.reset();
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Address
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Address Form */}
                    {showForm && (
                        <Card className="border-border/60 animate-scale-in">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    {hasSavedAddresses ? "New Address" : "Shipping Details"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your full name"
                                                            {...field}
                                                            aria-label="Full name"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="you@example.com"
                                                                {...field}
                                                                aria-label="Email address"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <div className="flex">
                                                                <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                                                                    +91
                                                                </span>
                                                                <Input
                                                                    placeholder="9876543210"
                                                                    className="rounded-l-none"
                                                                    maxLength={10}
                                                                    inputMode="numeric"
                                                                    pattern="[0-9]*"
                                                                    onKeyDown={(e) => {
                                                                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    {...field}
                                                                    aria-label="Phone number"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="addressLine"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="House/Flat no., Street, Landmark"
                                                            {...field}
                                                            aria-label="Street address"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <FormField
                                                control={form.control}
                                                name="pinCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>PIN Code</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="560001"
                                                                maxLength={6}
                                                                inputMode="numeric"
                                                                pattern="[0-9]*"
                                                                onKeyDown={(e) => {
                                                                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                {...field}
                                                                aria-label="PIN code"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Bengaluru"
                                                                {...field}
                                                                aria-label="City"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>State</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger aria-label="Select state">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {INDIAN_STATES.map((s) => (
                                                                    <SelectItem key={s} value={s}>
                                                                        {s}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="saveAddress"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            aria-label="Save this address for future orders"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal">
                                                        Save this address for future orders
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Desktop submit — hidden on mobile (sticky bar handles it) */}
                                        <div className="hidden sm:flex sm:gap-3">
                                            {hasSavedAddresses && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowForm(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                            <Button
                                                type="submit"
                                                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Saving…
                                                    </>
                                                ) : (
                                                    "Save Address"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}

                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                        <AlertDescription className="text-sm">
                            🌱 We ship in <strong>100% plastic-free</strong> packaging. Your
                            order will arrive in recycled cardboard and paper tape.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Sidebar Order Summary */}
                <aside className="hidden lg:block">
                    <Card className="sticky top-20 border-border/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {state.cart.cartItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="text-muted-foreground truncate mr-2">
                                        {item.product_name} × {item.quantity}
                                    </span>
                                    <span className="font-medium shrink-0">
                                        {formatCurrency(item.product_price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium">
                                    {formatCurrency(state.cart.shipping_fee)}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-emerald-600">
                                    {formatCurrency(grandTotal)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>

            {/* Sticky bottom bar — Back + Next Step */}
            <div className="sticky-bottom-bar">
                <div className="mx-auto flex max-w-5xl items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/")}
                        className="shrink-0"
                        aria-label="Go back to cart"
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200"
                        size="lg"
                        onClick={handleContinue}
                        disabled={!showForm && !selectedAddressId}
                        aria-label="Continue to payment"
                    >
                        {showForm ? (
                            isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                "Save & Continue"
                            )
                        ) : (
                            <>
                                Next Step
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
