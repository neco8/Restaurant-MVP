# Implementation Plan: Admin Order List

## Goal

Admin can view a list of all orders at `/admin/orders`, showing each order's status, total, creation date, and line items (product name, quantity, unit price).

---

## Walking Skeleton

```
Outside                                              Inside
┌────────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│ E2E Test       │ →  │ AdminOrderList   │ →  │ GET /api/admin/orders│
│ (Playwright)   │    │ Component + Page │    │ (Prisma query)       │
└────────────────┘    └──────────────────┘    └──────────────────────┘
 Write FIRST           Then this               Then this LAST
```

---

## Type Definitions

### API Response Shape

```typescript
// GET /api/admin/orders returns:
type AdminOrder = {
  id: string;
  status: string;          // "pending" | "completed"
  total: number;           // dollars (cents / 100)
  createdAt: string;       // ISO 8601
  items: AdminOrderItem[];
};

type AdminOrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;           // dollars (cents / 100)
};
```

---

## Commit Sequence

### 1. `acceptance red`: add e2e test for admin order list

**File**: `e2e/admin-orders.spec.ts`

- beforeAll: Insert test orders directly via Prisma (2 orders, one pending with 2 items, one completed with 1 item)
- afterAll: Clean up test data
- Test: "admin orders: view order list with status, total, and items"
  1. Navigate to `/admin/orders`
  2. Assert heading "Orders" is visible
  3. Assert both orders are displayed
  4. For each order: verify status, total (formatted as $X.XX), and item details (product name, quantity) are visible

**Helpers**: Add `seedTestOrders` / `cleanupOrders` to `e2e/helpers/test-data.ts` using the same Prisma pattern as existing product helpers.

---

### 2. `red`: add unit test for AdminOrderList rendering empty state

**File**: `src/components/AdminOrderList.test.tsx`

```
render(<AdminOrderList orders={[]} />)
expect "No orders found." to be in the document
```

---

### 3. `green`: implement AdminOrderList with empty state

**File**: `src/components/AdminOrderList.tsx`

- Accept `orders` prop (typed as `AdminOrder[]`)
- When empty → render `<p>No orders found.</p>`

---

### 4. `red`: add unit test for AdminOrderList rendering order rows

Add test: "renders order id, status, and total for each order"

- Pass 2 orders
- Assert each order's status, formatted total are visible

---

### 5. `green`: implement AdminOrderList with order rows

- Render a `<table>` with columns: Order ID, Status, Total, Date, Items
- Map over orders, render one `<tr>` per order
- Format total with `formatPrice`
- Format date with `toLocaleDateString` or similar

---

### 6. `red`: add unit test for AdminOrderList rendering order items

Add test: "renders item details for each order"

- Pass 1 order with 2 items
- Assert product names and quantities are visible (e.g. "Ramen ×2")

---

### 7. `green`: implement AdminOrderList with item rendering

- Within each order row, render a nested list of items
- Show: product name, quantity, unit price

---

### 8. `refactor`: extract AdminOrderList styling and structure

- Clean up table/list structure
- Ensure consistent styling with existing admin components (same CSS classes as AdminProductList)

---

### 9. `red`: add unit test for GET /api/admin/orders route

**File**: `src/app/api/admin/orders/route.test.ts`

- Mock `prisma.order.findMany`
- Test: "returns all orders with items and prices in dollars"
  - Mock returns 1 order with 1 item (prices in cents)
  - Assert response has prices converted to dollars
  - Assert includes product name (via relation)

---

### 10. `green`: implement GET /api/admin/orders route

**File**: `src/app/api/admin/orders/route.ts`

```typescript
export async function GET() {
  const rows = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  const orders = rows.map(row => ({
    id: row.id,
    status: row.status,
    total: row.total / 100,
    createdAt: row.createdAt.toISOString(),
    items: row.items.map(item => ({
      id: item.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price / 100,
    })),
  }));
  return NextResponse.json(orders);
}
```

---

### 11. `red`: add unit test for GET /api/admin/orders returning empty array

Add test: "returns empty array when no orders"

---

### 12. `green`: verify existing implementation handles empty case

(findMany returns `[]` → map returns `[]` → should already pass)

---

### 13. `red`: add page test for AdminOrdersPage fetching and rendering

**File**: `src/app/admin/orders/page.test.tsx`

- Mock fetch to return order data
- Assert AdminOrderList is rendered with orders

---

### 14. `green`: implement AdminOrdersPage

**File**: `src/app/admin/orders/page.tsx`

- Follow the exact pattern of `src/app/admin/products/page.tsx`:
  - `"use client"`
  - `useEffect` → `fetch("/api/admin/orders")` → `setOrders`
  - Render `<AdminOrderList orders={orders} />`
  - Same layout structure (Administration label, "Orders" heading)

---

### 15. `refactor`: add ADMIN_ORDERS route constant

**File**: `src/lib/routes.ts`

```typescript
ADMIN_ORDERS: "/admin/orders",
```

- Update page to use `ROUTES.ADMIN_ORDERS`
- Regenerate barrel export if needed

---

### 16. `green`: wire all layers — acceptance test passes

- Verify E2E test from step 1 passes
- All layers connected: Page → API → Prisma → DB

---

### 17. `refactor`: clean up and polish

- Ensure consistent styling with existing admin pages
- Review code for unnecessary complexity
- Verify all tests pass: `npx vitest run` and `npx playwright test`

---

## Files to Create / Modify

| Action | File |
|--------|------|
| Create | `e2e/admin-orders.spec.ts` |
| Create | `src/components/AdminOrderList.tsx` |
| Create | `src/components/AdminOrderList.test.tsx` |
| Create | `src/app/api/admin/orders/route.ts` |
| Create | `src/app/api/admin/orders/route.test.ts` |
| Create | `src/app/admin/orders/page.tsx` |
| Create | `src/app/admin/orders/page.test.tsx` |
| Modify | `src/lib/routes.ts` (add ADMIN_ORDERS) |
| Modify | `e2e/helpers/test-data.ts` (add order seed/cleanup helpers) |

---

## Key Patterns to Follow

1. **Price conversion**: DB stores cents → API returns dollars (`/ 100`)
2. **Prisma mock**: Use `vi.mock("@/server/prismaClient")` with typed mocks
3. **Component tests**: Use `@testing-library/react` with semantic queries (`getByRole`, `getByText`)
4. **E2E tests**: Seed data in `beforeAll`, clean up in `afterAll`
5. **Styling**: Match existing admin pages (serif headings, sans-serif labels, uppercase tracking)
6. **Route params**: Use `ROUTES` constants, not string literals
7. **API routes**: `export const dynamic = "force-dynamic"` to prevent caching
