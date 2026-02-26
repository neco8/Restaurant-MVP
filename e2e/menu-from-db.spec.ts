import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";

test("menu page shows products from the database", async ({ page }) => {
  await page.goto(ROUTES.MENU);

  await expect(page.getByText("Miso Soup")).toBeVisible();
  await expect(page.getByText("$5.00")).toBeVisible();
});
