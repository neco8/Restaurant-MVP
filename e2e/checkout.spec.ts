import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";

test.describe("Checkout Flow", () => {
  test("should complete full checkout: shop → cart → checkout → confirmation", async ({
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

    // 6. Place order
    await expect(
      page.getByRole("heading", { name: "Checkout" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Place Order" }).click();

    // 7. Order complete → 8. Go to order confirmation page
    await expect(page).toHaveURL(/\/orders\/.+\/complete/);
    await expect(
      page.getByRole("heading", { name: "Thank you for your order" })
    ).toBeVisible();
    await expect(page.getByTestId("order-id")).toBeVisible();
  });
});
