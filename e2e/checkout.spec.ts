import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";

async function fillStripePayment(page: Page) {
  await expect(page.locator("iframe[title='Card number']")).toBeVisible({ timeout: 15000 });
  await page.frameLocator("iframe[title='Card number']").locator("input").fill("4242424242424242");
  await page.frameLocator("iframe[title='Expiration date']").locator("input").fill("1230");
  await page.frameLocator("iframe[title='Security code']").locator("input").fill("123");
}

test("checkout: browse menu → add to cart → pay → order confirmed → cart emptied", async ({ page }) => {
  // Browse menu and select a product
  await page.goto(ROUTES.MENU);
  const firstProduct = page.getByTestId("product-card").first();
  const productName = await firstProduct.getByTestId("product-name").textContent();
  await firstProduct.click();

  // Verify correct product detail page and add to cart
  await expect(page.getByRole("heading", { name: productName! })).toBeVisible();
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByTestId("added-count")).toHaveText("1");

  // Proceed through cart to checkout
  await page.getByRole("link", { name: "View Cart" }).click();
  await expect(page.getByText(productName!)).toBeVisible();
  await page.getByRole("link", { name: "Proceed to Checkout" }).click();

  // Pay with test card
  await fillStripePayment(page);
  await page.getByRole("button", { name: "Place Order" }).click();

  // Order confirmed
  await expect(page).toHaveURL(/\/orders\/.+\/complete/);
  await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  await expect(page.getByTestId("payment-status")).toHaveText("Payment Complete");

  // Cart is empty after successful payment
  await page.goto(ROUTES.CHECKOUT);
  await expect(page.getByText("Your cart is empty")).toBeVisible();
});
