"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, ArrowLeft, Loader2 } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";

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

    const form = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingSchema),
        defaultValues: state.shippingAddress
            ? {
                fullName: state.shippingAddress.fullName,
                email: state.shippingAddress.email,
                phone: state.shippingAddress.phone,
                pinCode: state.shippingAddress.pinCode,
                city: state.shippingAddress.city,
                state: state.shippingAddress.state,
                saveAddress: state.shippingAddress.saveAddress,
            }
            : {
                fullName: "",
                email: "",
                phone: "",
                pinCode: "",
                city: "",
                state: "",
                saveAddress: false,
            },
    });

    // Redirect to cart if cart is empty — using useEffect to avoid side-effects during render
    useEffect(() => {
        if (itemCount === 0) {
            router.replace("/");
        }
    }, [itemCount, router]);

    function onSubmit(values: ShippingFormValues) {
        setIsSubmitting(true);
        dispatch({ type: "SET_ADDRESS", payload: values });
        router.push("/payment");
    }

    if (itemCount === 0) {
        return null;
    }

    return (
        <div>
            <ProgressStepper />
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div>
                    <div className="mb-6 flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/")}
                            className="h-9 w-9 rounded-full"
                            aria-label="Go back to cart"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">Shipping Address</h1>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

                                    <div className="grid gap-5 sm:grid-cols-2">
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

                                    <div className="grid gap-5 sm:grid-cols-3">
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
                                                                <SelectValue placeholder="Select state" />
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

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-emerald-600 text-white transition-[transform,background-color] duration-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
                                        disabled={isSubmitting}
                                        aria-label="Deliver to this address"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving…
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="mr-2 h-4 w-4" />
                                                Deliver to this Address
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Alert className="mt-4 border-emerald-200 bg-emerald-50 text-emerald-800">
                        <AlertDescription className="text-sm">
                            🌱 We ship in <strong>100% plastic-free</strong> packaging. Your
                            order will arrive in recycled cardboard and paper tape.
                        </AlertDescription>
                    </Alert>
                </div>

                <aside>
                    <Card className="sticky top-24">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {state.cart.cartItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="text-muted-foreground">
                                        {item.product_name} × {item.quantity}
                                    </span>
                                    <span className="font-medium">
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
        </div>
    );
}
