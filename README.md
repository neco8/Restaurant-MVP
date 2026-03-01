# 蓮華 (Renge) — Restaurant Ordering System

A full-stack restaurant ordering MVP. Customers browse the menu, add to cart, and pay with Stripe. Staff manage products and orders through an admin dashboard.

## Technical highlights

### Stripe E2E testing against real test credentials

Rather than mocking Stripe in E2E tests, this project runs against Stripe's actual test environment. Stripe's PaymentElement renders inside dynamically-loaded iframes with no stable selectors, so a frame-traversal helper polls all frames until the target input appears. CI environments with restricted outbound networks required an additional proxy-aware Stripe client configuration.

### Payment correctness under edge cases

Several non-obvious failure modes were handled explicitly:

- **Stale cart items**: the cart is stored in localStorage. If a product is deleted after being added to cart, sending those IDs to the payment intent API returns an error and the payment form never appears. The fix: fetch products first, filter the cart through them, then create the payment intent only with validated items.
- **Double-charge prevention**: `processing` status (ACH and other async payment methods) is treated the same as `succeeded` — clear cart and redirect immediately. Without this, customers on a frozen UI retry and get charged twice.
- **Server-side payment verification**: the order confirmation page re-verifies payment status directly with Stripe rather than trusting the client-side redirect. A manipulated URL cannot fake a successful payment.

### Schema design

Prices are stored as `Int` (cents) throughout — in the database, API, and cart state. No floating-point arithmetic in the payment path. `OrderItem` captures price at the time of order, not a reference to the current product price, so order history remains accurate after price changes.

### Test data isolation in E2E

Each test suite seeds its own fixed-ID records with `beforeAll` and cleans them up with `afterAll`. Tests never depend on production data and never pollute each other, which makes parallel test runs safe against a shared database.

## Tech stack

- **Next.js 14** (App Router) + TypeScript
- **Prisma** + **PostgreSQL** (Neon)
- **Stripe** (payments)
- **Vercel Blob** (image storage)
- **Tailwind CSS**
- **Vitest** + **Playwright**
- **neverthrow** (type-safe error handling)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (get from [Neon](https://neon.tech)) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` for development) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...` for development) |

### 3. Run database migrations

```bash
npx prisma migrate deploy
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
# Unit tests
npm run test:run

# E2E tests (requires running dev server and database)
npx playwright test
```
