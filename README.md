# Restaurant MVP

A Japanese restaurant ordering system built with Next.js. Customers can browse the menu, add items to cart, and pay with Stripe. Staff can manage products and orders from an admin dashboard.

## Features

- Menu browsing and product detail pages
- Shopping cart
- Checkout with Stripe payment
- Admin dashboard: product management (create, edit, list)
- Admin dashboard: order list with status updates

## Tech Stack

- **Next.js 14** (App Router)
- **Prisma** + **PostgreSQL** (via Neon)
- **Stripe** (payments)
- **Vercel Blob** (image storage)
- **Tailwind CSS**
- **neverthrow** (type-safe error handling)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values:

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
# Unit tests (Vitest)
npm run test:run

# E2E tests (Playwright) — requires a running dev server and database
npx playwright test
```
