import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (typeof value !== "number" || isNaN(value)) return "₹0";
  return `₹${Math.max(0, value).toLocaleString("en-IN")}`;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ECO-${timestamp}-${random}`;
}

/** Type-guard to validate persisted cart data shape from localStorage */
export function isValidCartData(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.cartItems)) return false;
  if (typeof obj.shipping_fee !== "number") return false;
  if (typeof obj.discount_applied !== "number") return false;
  return obj.cartItems.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).product_id === "number" &&
      typeof (item as Record<string, unknown>).product_name === "string" &&
      typeof (item as Record<string, unknown>).product_price === "number" &&
      typeof (item as Record<string, unknown>).quantity === "number"
  );
}

export function isValidShippingAddress(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.fullName === "string" &&
    typeof obj.email === "string" &&
    typeof obj.phone === "string" &&
    typeof obj.pinCode === "string" &&
    typeof obj.city === "string" &&
    typeof obj.state === "string" &&
    typeof obj.saveAddress === "boolean"
  );
}
