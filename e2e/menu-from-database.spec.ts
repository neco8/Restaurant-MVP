import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";

test("menu page shows products loaded from the database", async ({ page }) => {
  await page.goto(ROUTES.MENU);

  const productCards = page.getByTestId("product-card");
  await expect(productCards.first()).toBeVisible();

  const productName = await productCards
    .first()
    .getByTestId("product-name")
    .textContent();
  expect(productName).toBeTruthy();

  const productPrice = await productCards
    .first()
    .getByTestId("product-price")
    .textContent();
  expect(productPrice).toBeTruthy();
});
