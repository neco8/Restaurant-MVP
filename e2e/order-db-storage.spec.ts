import { test, expect } from "@playwright/test";
import {
  seedTestProducts,
  cleanupProducts,
  cleanupOrders,
  type TestProduct,
} from "./helpers/test-data";
import { ensureAdminSeeded, loginAsAdmin } from "./helpers/admin-login";

const ORDER_STORAGE_PRODUCTS: TestProduct[] = [
  {
    id: "order-storage-ramen",
    name: "Order Storage Ramen",
    description: "Ramen for order storage test",
    price: 1200,
    image: "",
  },
  {
    id: "order-storage-gyoza",
    name: "Order Storage Gyoza",
    description: "Gyoza for order storage test",
    price: 750,
    image: "",
  },
];

const productIds = ORDER_STORAGE_PRODUCTS.map((p) => p.id);
// We track created order IDs so we can clean them up after the test
const createdOrderIds: string[] = [];

test.describe("Order DB Storage via API", () => {
  test.beforeAll(async () => {
    await ensureAdminSeeded();
    await cleanupProducts(productIds);
    await seedTestProducts(ORDER_STORAGE_PRODUCTS);
  });

  test.afterAll(async () => {
    if (createdOrderIds.length > 0) {
      await cleanupOrders(createdOrderIds);
    }
    await cleanupProducts(productIds);
  });

  test("POST /api/orders creates an order and it appears on the admin orders page", async ({
    page,
  }) => {
    // Call POST /api/orders to create a new order from checkout data.
    // This endpoint does not exist yet, so the test will fail.
    const orderPayload = {
      items: [
        {
          productId: ORDER_STORAGE_PRODUCTS[0].id,
          quantity: 2,
          price: ORDER_STORAGE_PRODUCTS[0].price,
        },
        {
          productId: ORDER_STORAGE_PRODUCTS[1].id,
          quantity: 1,
          price: ORDER_STORAGE_PRODUCTS[1].price,
        },
      ],
    };

    const expectedTotal =
      ORDER_STORAGE_PRODUCTS[0].price * 2 + ORDER_STORAGE_PRODUCTS[1].price; // 3150

    const response = await page.request.post("/api/orders", {
      data: orderPayload,
    });

    // The API should return 201 with the created order
    expect(response.status()).toBe(201);

    const createdOrder = await response.json();

    expect(createdOrder).toMatchObject({
      id: expect.any(String),
      status: "pending",
      total: expectedTotal,
      items: expect.arrayContaining([
        expect.objectContaining({
          productId: ORDER_STORAGE_PRODUCTS[0].id,
          quantity: 2,
          price: ORDER_STORAGE_PRODUCTS[0].price,
        }),
        expect.objectContaining({
          productId: ORDER_STORAGE_PRODUCTS[1].id,
          quantity: 1,
          price: ORDER_STORAGE_PRODUCTS[1].price,
        }),
      ]),
    });

    // Track the order for cleanup
    createdOrderIds.push(createdOrder.id);

    // Verify the order appears on the admin orders page
    await loginAsAdmin(page);
    await page.goto("/admin/orders");

    await expect(
      page.getByRole("heading", { name: "Orders" })
    ).toBeVisible();

    // The total is 3150 cents = $31.50
    await expect(page.getByText("$31.50")).toBeVisible();

    // Verify the order row contains the product names
    await expect(page.getByText("Order Storage Ramen")).toBeVisible();
    await expect(page.getByText("Order Storage Gyoza")).toBeVisible();

    // Verify the order has pending status
    const orderRow = page
      .getByRole("row")
      .filter({ hasText: "Order Storage Ramen" });
    await expect(orderRow.getByText("pending")).toBeVisible();
  });
});
