import { test, expect } from "@playwright/test";
import {
  seedTestProducts,
  cleanupProducts,
  seedTestOrders,
  cleanupOrders,
  type TestProduct,
  type TestOrder,
} from "./helpers/test-data";

const ORDER_PRODUCTS: TestProduct[] = [
  {
    id: "order-test-ramen",
    name: "Order Test Ramen",
    description: "Ramen for order test",
    price: 1200,
    image: "",
  },
  {
    id: "order-test-gyoza",
    name: "Order Test Gyoza",
    description: "Gyoza for order test",
    price: 750,
    image: "",
  },
];

const TEST_ORDERS: TestOrder[] = [
  {
    id: "test-order-pending",
    status: "pending",
    total: 2700,
    items: [
      {
        id: "test-oi-ramen",
        productId: "order-test-ramen",
        quantity: 1,
        price: 1200,
      },
      {
        id: "test-oi-gyoza",
        productId: "order-test-gyoza",
        quantity: 2,
        price: 750,
      },
    ],
  },
  {
    id: "test-order-completed",
    status: "completed",
    total: 1200,
    items: [
      {
        id: "test-oi-ramen-2",
        productId: "order-test-ramen",
        quantity: 1,
        price: 1200,
      },
    ],
  },
];

test.describe("Admin Order List", () => {
  const productIds = ORDER_PRODUCTS.map((p) => p.id);
  const orderIds = TEST_ORDERS.map((o) => o.id);

  test.beforeAll(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
    await seedTestProducts(ORDER_PRODUCTS);
    await seedTestOrders(TEST_ORDERS);
  });

  test.afterAll(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
  });

  test("displays orders with status, total, and item details", async ({
    page,
  }) => {
    await page.goto("/admin/orders");

    await expect(
      page.getByRole("heading", { name: "Orders" })
    ).toBeVisible();

    await expect(page.getByRole("cell", { name: "pending", exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: "completed", exact: true })).toBeVisible();

    await expect(page.getByText("$27.00")).toBeVisible();
    await expect(page.getByText("$12.00")).toBeVisible();

    await expect(page.getByText("Order Test Ramen").first()).toBeVisible();
    await expect(page.getByText("Order Test Gyoza")).toBeVisible();
  });
});

const STATUS_UPDATE_PRODUCTS: TestProduct[] = [
  {
    id: "status-update-ramen",
    name: "Status Update Ramen",
    description: "Ramen for status update test",
    price: 1200,
    image: "",
  },
];

const STATUS_UPDATE_ORDERS: TestOrder[] = [
  {
    id: "test-order-status-update",
    status: "pending",
    total: 1200,
    items: [
      {
        id: "test-oi-status-ramen",
        productId: "status-update-ramen",
        quantity: 1,
        price: 1200,
      },
    ],
  },
];

test.describe("Admin Order Status Update", () => {
  const productIds = STATUS_UPDATE_PRODUCTS.map((p) => p.id);
  const orderIds = STATUS_UPDATE_ORDERS.map((o) => o.id);

  test.beforeAll(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
    await seedTestProducts(STATUS_UPDATE_PRODUCTS);
    await seedTestOrders(STATUS_UPDATE_ORDERS);
  });

  test.afterAll(async () => {
    await cleanupOrders(orderIds);
    await cleanupProducts(productIds);
  });

  test("updates order status from pending to completed", async ({ page }) => {
    await page.goto("/admin/orders");

    const row = page.getByRole("row").filter({ hasText: "Status Update Ramen" });
    await expect(row.getByText("pending")).toBeVisible();

    await row.getByRole("button", { name: "Mark as completed" }).click();

    await expect(row.getByText("completed")).toBeVisible();
    await expect(row.getByRole("button", { name: "Mark as completed" })).not.toBeVisible();
  });
});
