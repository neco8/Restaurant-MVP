import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";

/**
 * Seeds the cart via localStorage and navigates to the checkout page.
 * This avoids the full shop flow so tests can focus purely on the
 * Stripe Payment Element iframe structure.
 */
async function seedCartAndGoToCheckout(page: Page) {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify([{ id: "1", name: "Ramen", price: 12.0, quantity: 1 }])
    );
  });
  await page.goto(ROUTES.CHECKOUT);
}

/**
 * Waits for the Stripe Payment Element to finish rendering.
 * PaymentElement renders a dedicated iframe for the card number field first.
 */
async function waitForPaymentElement(page: Page) {
  await expect(page.locator("iframe[title='Card number']")).toBeVisible({
    timeout: 15000,
  });
}

test.describe("Stripe Payment Element iframe structure", () => {
  test.beforeEach(async ({ page }) => {
    await seedCartAndGoToCheckout(page);
    await waitForPaymentElement(page);
  });

  // --- Structure tests ---

  test("renders a dedicated iframe for the card number field", async ({ page }) => {
    // PaymentElement places each sensitive field in its own iframe.
    await expect(page.locator("iframe[title='Card number']")).toBeVisible();
  });

  test("renders a dedicated iframe for the expiration date field", async ({ page }) => {
    await expect(page.locator("iframe[title='Expiration date']")).toBeVisible();
  });

  test("renders a dedicated iframe for the security code field", async ({ page }) => {
    await expect(page.locator("iframe[title='Security code']")).toBeVisible();
  });

  // --- Fill-via-correct-selectors tests ---

  test("card number field is fillable via its dedicated iframe", async ({ page }) => {
    await page
      .frameLocator("iframe[title='Card number']")
      .locator("input")
      .fill("4242424242424242");

    // Stripe auto-formats the number with spaces on blur/change.
    await expect(
      page.frameLocator("iframe[title='Card number']").locator("input")
    ).toHaveValue("4242 4242 4242 4242");
  });

  test("expiration date field is fillable via its dedicated iframe", async ({ page }) => {
    await page
      .frameLocator("iframe[title='Expiration date']")
      .locator("input")
      .fill("1230");

    await expect(
      page.frameLocator("iframe[title='Expiration date']").locator("input")
    ).not.toHaveValue("");
  });

  test("security code field is fillable via its dedicated iframe", async ({ page }) => {
    await page
      .frameLocator("iframe[title='Security code']")
      .locator("input")
      .fill("123");

    await expect(
      page.frameLocator("iframe[title='Security code']").locator("input")
    ).toHaveValue("123");
  });

  // --- Regression guard: legacy CardElement selector does NOT work ---

  test("card inputs are NOT accessible via the legacy CardElement iframe pattern", async ({
    page,
  }) => {
    // The old fillStripePayment used:
    //   page.frameLocator("iframe[title='Secure payment input frame']")
    //       .getByPlaceholder(/card number/i)
    //
    // That pattern is for CardElement (legacy), which bundles all fields into a
    // single "Secure payment input frame" iframe.  PaymentElement uses separate
    // per-field iframes, so the card-number placeholder is NOT directly accessible
    // inside "Secure payment input frame".
    const legacyCardInput = page
      .frameLocator("iframe[title='Secure payment input frame']")
      .getByPlaceholder(/card number/i);

    await expect(legacyCardInput).toHaveCount(0);
  });
});
