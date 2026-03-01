import { test, expect } from "@playwright/test";
import pg from "pg";
import {
  seedTestProducts,
  cleanupProducts,
  cleanupOrders,
  type TestProduct,
  type TestOrder,
} from "./helpers/test-data";

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return new pg.Pool({ connectionString });
}

type TestOrderWithDate = TestOrder & { createdAt: Date };

async function seedOrdersWithDates(
  orders: TestOrderWithDate[]
): Promise<void> {
  const pool = createPool();
  try {
    for (const order of orders) {
      await pool.query(
        `INSERT INTO "Order" (id, status, total, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $4)
         ON CONFLICT (id) DO UPDATE SET status = $2, total = $3, "createdAt" = $4, "updatedAt" = $4`,
        [order.id, order.status, order.total, order.createdAt]
      );
      for (const item of order.items) {
        await pool.query(
          `INSERT INTO "OrderItem" (id, quantity, price, "productId", "orderId")
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET quantity = $2, price = $3`,
          [item.id, item.quantity, item.price, item.productId, order.id]
        );
      }
    }
  } finally {
    await pool.end();
  }
}

const DASHBOARD_PRODUCTS: TestProduct[] = [
  {
    id: "dash-product-ramen",
    name: "Dashboard Ramen",
    description: "Ramen for dashboard test",
    price: 1000,
    image: "",
  },
];

const productIds = DASHBOARD_PRODUCTS.map((p) => p.id);

test.describe("Admin Dashboard Recent Orders — empty state", () => {
  test.beforeAll(async () => {
    await cleanupProducts(productIds);
    await seedTestProducts(DASHBOARD_PRODUCTS);
  });

  test.afterAll(async () => {
    await cleanupProducts(productIds);
  });

  test("shows empty message when there are no orders", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.getByText("まだ注文はありません")).toBeVisible();
  });
});

test.describe("Admin Dashboard Recent Orders — with orders", () => {
  const orders: TestOrderWithDate[] = [
    {
      id: "dash-order-1-oldest",
      status: "pending",
      total: 1000,
      createdAt: new Date("2025-01-01T10:00:00Z"),
      items: [
        {
          id: "dash-oi-1",
          productId: "dash-product-ramen",
          quantity: 1,
          price: 1000,
        },
      ],
    },
    {
      id: "dash-order-2",
      status: "done",
      total: 2000,
      createdAt: new Date("2025-01-02T10:00:00Z"),
      items: [
        {
          id: "dash-oi-2",
          productId: "dash-product-ramen",
          quantity: 2,
          price: 1000,
        },
      ],
    },
    {
      id: "dash-order-3",
      status: "pending",
      total: 3000,
      createdAt: new Date("2025-01-03T10:00:00Z"),
      items: [
        {
          id: "dash-oi-3",
          productId: "dash-product-ramen",
          quantity: 3,
          price: 1000,
        },
      ],
    },
    {
      id: "dash-order-4",
      status: "preparing",
      total: 4000,
      createdAt: new Date("2025-01-04T10:00:00Z"),
      items: [
        {
          id: "dash-oi-4",
          productId: "dash-product-ramen",
          quantity: 4,
          price: 1000,
        },
      ],
    },
    {
      id: "dash-order-5-newest",
      status: "pending",
      total: 5000,
      createdAt: new Date("2025-01-05T10:00:00Z"),
      items: [
        {
          id: "dash-oi-5",
          productId: "dash-product-ramen",
          quantity: 5,
          price: 1000,
        },
      ],
    },
  ];

  const orderIds = orders.map((o) => o.id);

  test.beforeAll(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
    await seedTestProducts(DASHBOARD_PRODUCTS);
    await seedOrdersWithDates(orders);
  });

  test.afterAll(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
  });

  test("shows latest 5 orders sorted by date descending", async ({ page }) => {
    await page.goto("/admin");

    const rows = page.locator("table tbody tr");
    await expect(rows).toHaveCount(5);

    // First row should be the newest order, last row the oldest
    await expect(rows.nth(0)).toContainText("$50.00");
    await expect(rows.nth(4)).toContainText("$10.00");
  });

  test("each row shows order number, date, total, and status", async ({
    page,
  }) => {
    await page.goto("/admin");

    const rows = page.locator("table tbody tr");
    const firstRow = rows.nth(0);

    // Order number (the id or a fragment of it)
    await expect(firstRow).toContainText("dash-order-5-newest");
    // Total amount
    await expect(firstRow).toContainText("$50.00");
    // Status
    await expect(firstRow).toContainText("pending");
    // Date — at least the year portion should be visible
    await expect(firstRow).toContainText("2025");
  });

  test("does not show 'view all' link when 5 or fewer orders", async ({
    page,
  }) => {
    await page.goto("/admin");

    await expect(
      page.getByRole("link", { name: "すべての注文を見る" })
    ).not.toBeVisible();
  });

  test("clicking a row navigates to order detail page", async ({ page }) => {
    await page.goto("/admin");

    const rows = page.locator("table tbody tr");
    await rows.nth(0).click();

    await expect(page).toHaveURL("/admin/orders/dash-order-5-newest");
  });
});

test.describe("Admin Dashboard Recent Orders — more than 5 orders", () => {
  const orders: TestOrderWithDate[] = Array.from({ length: 7 }, (_, i) => ({
    id: `dash-many-order-${i + 1}`,
    status: "pending" as const,
    total: (i + 1) * 1000,
    createdAt: new Date(`2025-02-${String(i + 1).padStart(2, "0")}T10:00:00Z`),
    items: [
      {
        id: `dash-many-oi-${i + 1}`,
        productId: "dash-product-ramen",
        quantity: i + 1,
        price: 1000,
      },
    ],
  }));

  const orderIds = orders.map((o) => o.id);

  test.beforeAll(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
    await seedTestProducts(DASHBOARD_PRODUCTS);
    await seedOrdersWithDates(orders);
  });

  test.afterAll(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
  });

  test("shows only 5 rows when more than 5 orders exist", async ({ page }) => {
    await page.goto("/admin");

    const rows = page.locator("table tbody tr");
    await expect(rows).toHaveCount(5);
  });

  test("shows 'view all' link that navigates to orders page", async ({
    page,
  }) => {
    await page.goto("/admin");

    const viewAllLink = page.getByRole("link", { name: "すべての注文を見る" });
    await expect(viewAllLink).toBeVisible();

    await viewAllLink.click();

    await expect(page).toHaveURL("/admin/orders");
  });
});

test.describe("Admin Dashboard Recent Orders — status update", () => {
  const orders: TestOrderWithDate[] = [
    {
      id: "dash-status-order",
      status: "pending",
      total: 1000,
      createdAt: new Date("2025-03-01T10:00:00Z"),
      items: [
        {
          id: "dash-status-oi",
          productId: "dash-product-ramen",
          quantity: 1,
          price: 1000,
        },
      ],
    },
  ];

  const orderIds = orders.map((o) => o.id);

  test.beforeEach(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
    await seedTestProducts(DASHBOARD_PRODUCTS);
    await seedOrdersWithDates(orders);
  });

  test.afterEach(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
  });

  test("can change order status via dropdown and it persists after reload", async ({
    page,
  }) => {
    await page.goto("/admin");

    const row = page.locator("table tbody tr").filter({ hasText: "dash-status-order" });
    await expect(row).toContainText("pending");

    // Change status via dropdown select
    const statusSelect = row.getByRole("combobox");
    await statusSelect.selectOption("preparing");

    // Status updates in the UI without reload
    await expect(row).toContainText("preparing");

    // Reload and verify it persisted
    await page.reload();

    const rowAfterReload = page
      .locator("table tbody tr")
      .filter({ hasText: "dash-status-order" });
    await expect(rowAfterReload).toContainText("preparing");
  });
});
