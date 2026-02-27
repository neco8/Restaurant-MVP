import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test("displays dashboard with links to Products and Orders", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await expect(page.getByRole("link", { name: "Products" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
  });

  test("navigates to products page from dashboard", async ({ page }) => {
    await page.goto("/admin");

    await page.getByRole("link", { name: "Products" }).click();

    await expect(page).toHaveURL("/admin/products");
  });

  test("navigates to orders page from dashboard", async ({ page }) => {
    await page.goto("/admin");

    await page.getByRole("link", { name: "Orders" }).click();

    await expect(page).toHaveURL("/admin/orders");
  });
});
