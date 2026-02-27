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

    await expect(page.getByText("pending")).toBeVisible();
    await expect(page.getByText("completed")).toBeVisible();

    await expect(page.getByText("$27.00")).toBeVisible();
    await expect(page.getByText("$12.00")).toBeVisible();

    await expect(page.getByText("Order Test Ramen")).toBeVisible();
    await expect(page.getByText("Order Test Gyoza")).toBeVisible();
  });
});
