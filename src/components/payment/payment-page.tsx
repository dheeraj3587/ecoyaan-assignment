"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Lock,
    Loader2,
    ArrowLeft,
    MapPin,
    AlertCircle,
    Smartphone,
    CreditCard,
    Building,
    Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProgressStepper } from "@/components/checkout/progress-stepper";
import { useCheckout } from "@/context/checkout-context";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "upi" | "card" | "netbanking";
type ButtonState = "idle" | "processing" | "success";

const UPI_ID_REGEX = /^[\w.-]+@[\w]+$/;

export function PaymentPage() {
    const router = useRouter();
    const { state, dispatch, subtotal, grandTotal } = useCheckout();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
    const [upiId, setUpiId] = useState("");
    const [buttonState, setButtonState] = useState<ButtonState>("idle");
    const [error, setError] = useState<string | null>(null);

    const { shippingAddress, cart } = state;

    // Redirect to home if missing required data — via useEffect to avoid side-effects during render
    const shouldRedirect = !shippingAddress || cart.cartItems.length === 0;
    useEffect(() => {
        if (shouldRedirect) {
            router.replace("/");
        }
    }, [shouldRedirect, router]);

    if (shouldRedirect) {
        return null;
    }

    async function handlePayment() {
        setError(null);

        // Validate UPI ID when UPI is selected
        if (paymentMethod === "upi") {
            if (!upiId.trim()) {
                setError("Please enter your UPI ID.");
                return;
            }
            if (!UPI_ID_REGEX.test(upiId.trim())) {
                setError("Please enter a valid UPI ID (e.g. yourname@upi).");
                return;
            }
        }

        setButtonState("processing");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const paymentFailed = Math.random() < 0.2;

        if (paymentFailed) {
            setError(
                "Payment failed. Please try again or use a different payment method."
            );
            setButtonState("idle");
            return;
        }

        setButtonState("success");
        // Clear both localStorage and in-memory state
        try { localStorage.removeItem("ecoyaan-checkout"); } catch { /* ignore */ }
        dispatch({ type: "CLEAR_STATE" });

        await new Promise((resolve) => setTimeout(resolve, 1200));
        router.push("/success");
    }

    return (
        <div>
            <ProgressStepper />
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/shipping")}
                            className="h-9 w-9 rounded-full"
                            aria-label="Go back to shipping"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">Payment</h1>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-4 w-4 text-emerald-600" />
                                Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm leading-relaxed">
                                <p className="font-semibold">{shippingAddress.fullName}</p>
                                <p className="text-muted-foreground">
                                    {shippingAddress.city}, {shippingAddress.state} —{" "}
                                    {shippingAddress.pinCode}
                                </p>
                                <p className="text-muted-foreground">
                                    {shippingAddress.email} · +91 {shippingAddress.phone}
                                </p>
                            </div>
                            <Button
                                variant="link"
                                className="mt-1 h-auto p-0 text-emerald-600"
                                onClick={() => router.push("/shipping")}
                                aria-label="Change delivery address"
                            >
                                Change
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={paymentMethod}
                                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                                className="space-y-3"
                            >
                                <label
                                    htmlFor="upi"
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-sm ${paymentMethod === "upi"
                                        ? "border-emerald-600 bg-emerald-50"
                                        : "border-border"
                                        }`}
                                >
                                    <RadioGroupItem value="upi" id="upi" />
                                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">UPI</p>
                                        <p className="text-xs text-muted-foreground">
                                            Pay using any UPI app
                                        </p>
                                    </div>
                                </label>

                                <label
                                    htmlFor="card"
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-sm ${paymentMethod === "card"
                                        ? "border-emerald-600 bg-emerald-50"
                                        : "border-border"
                                        }`}
                                >
                                    <RadioGroupItem value="card" id="card" />
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Credit / Debit Card</p>
                                        <p className="text-xs text-muted-foreground">
                                            Visa, Mastercard, RuPay
                                        </p>
                                    </div>
                                </label>

                                <label
                                    htmlFor="netbanking"
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-sm ${paymentMethod === "netbanking"
                                        ? "border-emerald-600 bg-emerald-50"
                                        : "border-border"
                                        }`}
                                >
                                    <RadioGroupItem value="netbanking" id="netbanking" />
                                    <Building className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Net Banking</p>
                                        <p className="text-xs text-muted-foreground">
                                            All major banks supported
                                        </p>
                                    </div>
                                </label>
                            </RadioGroup>

                            {paymentMethod === "upi" && (
                                <div className="mt-4">
                                    <Label htmlFor="upi-id">UPI ID</Label>
                                    <Input
                                        id="upi-id"
                                        placeholder="yourname@upi"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="mt-1.5"
                                        aria-label="Enter UPI ID"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                        <AlertDescription className="text-sm">
                            🌿 <strong>Eco Pledge:</strong> 1% of every transaction goes towards
                            planting trees. Your order contributes to a greener planet.
                        </AlertDescription>
                    </Alert>
                </div>

                <aside>
                    <Card className="sticky top-24">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {cart.cartItems.map((item) => (
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
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{formatCurrency(cart.shipping_fee)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-bold">Total</span>
                                <span className="text-lg font-bold text-emerald-600">
                                    {formatCurrency(grandTotal)}
                                </span>
                            </div>

                            <Button
                                size="lg"
                                className={`mt-3 w-full transition-[transform,background-color] duration-500 ${buttonState === "success"
                                        ? "bg-emerald-500 hover:bg-emerald-500 scale-105"
                                        : "bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
                                    } text-white`}
                                onClick={handlePayment}
                                disabled={buttonState !== "idle"}
                                aria-label="Pay securely"
                            >
                                {buttonState === "success" ? (
                                    <span className="flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 animate-in zoom-in duration-300">
                                            <Check className="h-4 w-4" strokeWidth={3} />
                                        </span>
                                        Payment Successful!
                                    </span>
                                ) : buttonState === "processing" ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing…
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Pay Securely · {formatCurrency(grandTotal)}
                                    </>
                                )}
                            </Button>

                            <p className="pt-1 text-center text-xs text-muted-foreground">
                                256-bit SSL encrypted payment
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
