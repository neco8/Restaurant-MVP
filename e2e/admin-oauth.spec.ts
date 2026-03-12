import { test, expect } from "@playwright/test";

test.describe("Admin OAuth Authentication", () => {
  test("shows a Google OAuth sign-in link on the login page", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    await expect(
      page.getByRole("link", { name: /sign in with google/i })
    ).toBeVisible();
  });

  test("sign-in link points to the Google OAuth endpoint", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    const signInLink = page.getByRole("link", { name: /sign in with google/i });
    await expect(signInLink).toHaveAttribute("href", /\/api\/auth\/google/);
  });
});
