# Ecoyaan — Eco-Friendly Checkout Flow

A 4-screen checkout flow for the Ecoyaan platform. Built with Next.js 16 App Router, shadcn/ui, and Tailwind CSS v4.

Live: **https://assingment-6dqpx18t7-dheeraj3587s-projects.vercel.app**

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Forms | react-hook-form + Zod |
| State | React Context + useReducer |
| Icons | lucide-react |
| Font | Inter (Google Fonts) |

## Screens

| Route | What it does |
|---|---|
| `/` | Cart page — quantity controls, item removal, order summary with eco-impact stat |
| `/shipping` | Shipping form — name, email, phone (+91), PIN code, city, state dropdown. Zod-validated. Numeric-only inputs for phone/PIN. |
| `/payment` | Payment method picker (UPI / Card / Net Banking). UPI ID validation. Shows delivery address with edit link. 20% simulated failure rate for demo. |
| `/success` | Animated confirmation — order ID, delivery estimate, plastic-saved counter |

## Architecture

- **Server-side data fetching** — Cart data loaded in a Server Component (`app/page.tsx` → `lib/cart-data.ts`). No API route self-call.
- **Layout-level provider** — `CheckoutProvider` in `layout.tsx` persists cart + address state across navigations.
- **Route-derived stepper** — Progress bar reads `usePathname()` to determine active step. No manual step state.
- **localStorage persistence** — State saved on every change, restored on mount. Validated on hydration (shape-checked, not blindly trusted). Writes wrapped in try/catch for incognito/restricted browsers.
- **Redirect guards** — Shipping and payment pages redirect to `/` if required data is missing, via `useEffect` (not during render).
- **Grand total clamping** — `Math.max(0, ...)` prevents negative totals if discount exceeds subtotal.

## Security

- HTTP headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy` (configured in `next.config.ts`)
- localStorage data validated with type-guards before hydrating into state
- UPI ID regex validation before payment submission
- Images served through Next.js `<Image>` with domain allowlisting
- Order IDs use timestamp + random for low collision probability
- `suppressHydrationWarning` on `<html>`/`<body>` to handle browser extension attribute injection

## Running Locally

```bash
git clone https://github.com/dheeraj3587/ecoyaan-assignment.git
cd ecoyaan-assignment
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Cart (Server Component)
│   ├── layout.tsx            # Root layout + CheckoutProvider
│   ├── loading.tsx           # Cart skeleton
│   ├── shipping/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── payment/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── success/
│       └── page.tsx
├── components/
│   ├── cart/                 # CartItemCard, OrderSummary, CartPage
│   ├── shipping/             # ShippingPage (form + Zod validation)
│   ├── payment/              # PaymentPage (method picker + pay CTA)
│   ├── checkout/             # ProgressStepper
│   ├── layout/               # Header
│   └── ui/                   # shadcn primitives
├── context/
│   └── checkout-context.tsx  # useReducer + localStorage + validation
└── lib/
    ├── cart-data.ts          # Mock cart data
    ├── types.ts              # TypeScript interfaces
    └── utils.ts              # formatCurrency, generateOrderId, validators
```
