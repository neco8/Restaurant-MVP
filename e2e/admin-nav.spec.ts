import { test, expect } from "@playwright/test";
import { ensureAdminSeeded, loginAsAdmin } from "./helpers/admin-login";

test.describe("Admin Navigation", () => {
  test.beforeAll(async () => {
    await ensureAdminSeeded();
  });

  test.afterAll(async () => {

  });

  test("navigates from products to orders via nav link", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products");

    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();

    await page.getByRole("link", { name: "Orders" }).click();

    await expect(page).toHaveURL("/admin/orders");
    await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();
  });

  test("navigates from orders to products via nav link", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/orders");

    await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();

    await page.getByRole("link", { name: "Products" }).click();

    await expect(page).toHaveURL("/admin/products");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });
});
