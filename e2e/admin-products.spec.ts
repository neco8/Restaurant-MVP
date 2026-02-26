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

test.describe("Admin Edit Product", () => {
  test.beforeAll(async () => {
    await cleanupProducts(productIds);
    await seedTestProducts(TEST_PRODUCTS);
  });

  test.afterAll(async () => {
    await cleanupProducts(productIds);
  });

  test("edits an existing product and sees updated name in the list", async ({ page }) => {
    await page.goto("/admin/products");
    await page.getByRole("link", { name: `Edit ${TEST_PRODUCTS[0].name}` }).click();
    await expect(page).toHaveURL(`/admin/products/${TEST_PRODUCTS[0].id}/edit`);

    await page.getByLabel("Name").fill("Updated Ramen");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page).toHaveURL("/admin/products");
    await expect(page.getByText("Updated Ramen")).toBeVisible();
  });
});

test.describe("Admin Delete Product", () => {
  test.beforeAll(async () => {
    await cleanupProducts(productIds);
    await seedTestProducts(TEST_PRODUCTS);
  });

  test.afterAll(async () => {
    await cleanupProducts(productIds);
  });

  test("deletes a product and it disappears from the list", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.getByText(TEST_PRODUCTS[0].name)).toBeVisible();

    await page.getByRole("button", { name: `Delete ${TEST_PRODUCTS[0].name}` }).click();

    await expect(page.getByText(TEST_PRODUCTS[0].name)).not.toBeVisible();
  });
});
