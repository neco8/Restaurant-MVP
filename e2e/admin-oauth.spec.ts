import { test, expect } from "@playwright/test";

test.describe("Admin OAuth Authentication", () => {
  test("shows a Google OAuth sign-in button on the login page", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    await expect(
      page.getByRole("button", { name: /sign in with google/i })
    ).toBeVisible();
  });

  test("redirects to Google OAuth when clicking sign-in button", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    await page.getByRole("button", { name: /sign in with google/i }).click();

    await expect(page).toHaveURL(/accounts\.google\.com/);
  });
});
