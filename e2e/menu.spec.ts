import { test, expect } from "@playwright/test";
import {
  seedTestProducts,
  cleanupProducts,
  TEST_PRODUCTS,
} from "./helpers/test-data";

const productIds = TEST_PRODUCTS.map((p) => p.id);

test.describe("Menu Page", () => {
  test.beforeAll(async () => {
    await cleanupProducts(productIds);
    await seedTestProducts(TEST_PRODUCTS);
  });

  test.afterAll(async () => {
    await cleanupProducts(productIds);
  });

  test("displays products from the database", async ({ page }) => {
    await page.goto("/menu");
    for (const product of TEST_PRODUCTS) {
      await expect(page.getByText(product.name)).toBeVisible();
    }
  });
});
