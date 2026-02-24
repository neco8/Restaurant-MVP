import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";

/**
 * Fill test card details inside the Stripe Payment Element iframe
 */
async function fillStripePayment(page: Page) {
  const stripeFrame = page
    .frameLocator("iframe[title='Secure payment input frame']")
    .first();

  await stripeFrame
    .getByPlaceholder(/card number/i)
    .fill("4242424242424242");
  await stripeFrame.getByPlaceholder(/expir/i).fill("1230");
  await stripeFrame.getByPlaceholder(/cvc/i).fill("123");
}

test.describe("Checkout Flow", () => {
  test("should complete full checkout with Stripe payment: shop → cart → payment → confirmation", async ({
    page,
  }) => {
    // 1. Open the product list from the main page
    await page.goto("/");
    await page.getByRole("link", { name: "Menu" }).click();
    await expect(page).toHaveURL(ROUTES.MENU);

    // Verify the product list is displayed
    await expect(
      page.getByRole("heading", { name: "Menu" })
    ).toBeVisible();
    const productCards = page.getByTestId("product-card");
    await expect(productCards.first()).toBeVisible();

    // 2. Select a product → 3. Go to the product detail page
    const firstProductName = await productCards
      .first()
      .getByTestId("product-name")
      .textContent();
    await productCards.first().click();
    await expect(page).toHaveURL(/\/menu\/.+/);

    // Verify product details are displayed
    await expect(
      page.getByRole("heading", { name: firstProductName! })
    ).toBeVisible();
    await expect(page.getByTestId("product-price")).toBeVisible();
    await expect(page.getByTestId("product-description")).toBeVisible();

    // 4. Add to cart
    await page.getByRole("button", { name: "Add to Cart" }).click();

    // Verify cart count feedback
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    // 5. Proceed to checkout
    await page.getByRole("link", { name: "View Cart" }).click();
    await expect(page).toHaveURL(ROUTES.CART);

    // Verify the product is in the cart
    await expect(page.getByText(firstProductName!)).toBeVisible();
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
    await expect(page).toHaveURL(ROUTES.CHECKOUT);

    // 6. Enter payment details on checkout page
    await expect(
      page.getByRole("heading", { name: "Checkout" })
    ).toBeVisible();
    await expect(page.getByTestId("checkout-total")).toBeVisible();

    // Wait for Stripe Payment Element iframe to load
    await expect(
      page.frameLocator("iframe[title='Secure payment input frame']").first()
        .locator("body")
    ).toBeAttached();

    // Fill in test card details
    await fillStripePayment(page);

    // Confirm the order
    await page.getByRole("button", { name: "Place Order" }).click();

    // 7. Order confirmation page
    await expect(page).toHaveURL(/\/orders\/.+\/complete/);
    await expect(
      page.getByRole("heading", { name: "Thank you for your order" })
    ).toBeVisible();
    await expect(page.getByTestId("order-id")).toBeVisible();

    // Verify payment was completed
    await expect(page.getByTestId("payment-status")).toHaveText("Payment Complete");
  });

  test("should clear cart after successful payment", async ({ page }) => {
    // Add item to cart via menu → product detail
    await page.goto(ROUTES.MENU);
    const productCards = page.getByTestId("product-card");
    await expect(productCards.first()).toBeVisible();
    await productCards.first().click();
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    // Navigate to checkout and complete payment
    await page.getByRole("link", { name: "View Cart" }).click();
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
    await expect(page).toHaveURL(ROUTES.CHECKOUT);

    await expect(
      page.frameLocator("iframe[title='Secure payment input frame']").first().locator("body")
    ).toBeAttached();
    await fillStripePayment(page);
    await page.getByRole("button", { name: "Place Order" }).click();

    // Wait for order confirmation
    await expect(page).toHaveURL(/\/orders\/.+\/complete/);
    await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();

    // 8. Cart must be empty after payment — navigate back to checkout and verify
    await page.goto(ROUTES.CHECKOUT);
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });
});
