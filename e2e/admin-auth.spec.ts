import { test, expect } from "@playwright/test";
import { seedTestAdmin, cleanupTestAdmin } from "./helpers/test-admin";

const TEST_ADMIN = {
  email: "e2e-admin-auth@test.local",
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

  test("login page shows Sign in with Google link", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(
      page.getByRole("link", { name: /sign in with google/i })
    ).toBeVisible();
  });

  test("authenticated admin can access /admin", async ({ page }) => {
    await page.context().addCookies([
      {
        name: "session",
        value: TEST_ADMIN.email,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await page.goto("/admin");

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page).not.toHaveURL(/\/admin\/login/);
  });

  test("logs out admin and prevents access to /admin", async ({ page }) => {
    await page.context().addCookies([
      {
        name: "session",
        value: TEST_ADMIN.email,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin$/);

    // Log out
    await page.getByRole("button", { name: /log out/i }).click();

    await expect(page).toHaveURL(/\/admin\/login/);

    // Verify cannot access /admin anymore
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
