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

test.describe("Admin Add Product", () => {
  test.afterEach(async () => {
    await cleanupProducts(["new-test-udon"]);
  });

  test("adds a new product via form and sees it in the list", async ({ page }) => {
    await page.goto("/admin/products");
    await page.getByRole("link", { name: "Add Product" }).click();
    await expect(page).toHaveURL("/admin/products/new");

    await page.getByLabel("Name").fill("New Test Udon");
    await page.getByLabel("Description").fill("Thick wheat noodles");
    await page.getByLabel("Price").fill("10.00");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page).toHaveURL("/admin/products");
    await expect(page.getByText("New Test Udon")).toBeVisible();
  });
});
