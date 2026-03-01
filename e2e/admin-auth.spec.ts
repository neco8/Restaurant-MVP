import { test, expect } from "@playwright/test";
import { seedTestAdmin, cleanupTestAdmin } from "./helpers/test-admin";

const TEST_ADMIN = {
  email: "e2e-admin-auth@test.local",
  password: "Test-Password-123!",
};

test.describe("Admin Authentication", () => {
  test.beforeAll(async () => {
    await seedTestAdmin(TEST_ADMIN);
  });

  test.afterAll(async () => {
    await cleanupTestAdmin(TEST_ADMIN.email);
  });

  test("redirects unauthenticated user from /admin to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("redirects unauthenticated user from /admin/products to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin/products");

    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("shows error for invalid credentials and stays on login page", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    await page.getByLabel("Email").fill("wrong@test.local");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText(/invalid/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("redirects to /admin after successful login", async ({ page }) => {
    await page.goto("/admin/login");

    await page.getByLabel("Email").fill(TEST_ADMIN.email);
    await page.getByLabel("Password").fill(TEST_ADMIN.password);
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).toHaveURL(/\/admin$/);
  });

  test("logs out admin and prevents access to /admin", async ({ page }) => {
    // Log in first
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(TEST_ADMIN.email);
    await page.getByLabel("Password").fill(TEST_ADMIN.password);
    await page.getByRole("button", { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/admin$/);

    // Log out
    await page.getByRole("button", { name: /log out/i }).click();

    await expect(page).toHaveURL(/\/admin\/login/);

    // Verify cannot access /admin anymore
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
