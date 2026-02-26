import { test, expect } from "@playwright/test";
import {
  seedTestProducts,
  cleanupProducts,
  TEST_PRODUCTS,
} from "./helpers/test-data";

const productIds = TEST_PRODUCTS.map((p) => p.id);

test.describe("Admin Products Page", () => {
  test.beforeAll(async () => {
    await cleanupProducts(productIds);
    await seedTestProducts(TEST_PRODUCTS);
  });

  test.afterAll(async () => {
    await cleanupProducts(productIds);
  });

  test("displays products on admin products page", async ({ page }) => {
    await page.goto("/admin/products");
    for (const product of TEST_PRODUCTS) {
      await expect(page.getByText(product.name)).toBeVisible();
    }
  });
});
