import { test, expect } from "@playwright/test";
import {
  seedTestProducts,
  cleanupTestProducts,
  TEST_PRODUCTS,
} from "./helpers/test-data";

test.describe("Menu Page", () => {
  test.beforeAll(async () => {
    await cleanupTestProducts();
    await seedTestProducts(TEST_PRODUCTS);
  });

  test.afterAll(async () => {
    await cleanupTestProducts();
  });

  test("displays products from the database", async ({ page }) => {
    await page.goto("/menu");
    for (const product of TEST_PRODUCTS) {
      await expect(page.getByText(product.name)).toBeVisible();
    }
  });
});
