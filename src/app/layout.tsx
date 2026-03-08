import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CheckoutProvider } from "@/context/checkout-context";
import { Header } from "@/components/layout/header";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecoyaan — Sustainable Shopping, Simplified",
  description:
    "Shop eco-friendly products that reduce plastic waste. Bamboo toothbrushes, reusable bags, and more — delivered in 100% plastic-free packaging.",
  keywords: ["eco-friendly", "sustainable", "shopping", "plastic-free", "ecoyaan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <CheckoutProvider>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </CheckoutProvider>
      </body>
    </html>
  );
}
