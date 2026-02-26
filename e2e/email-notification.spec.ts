import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";
import { seedTestProducts, cleanupProducts, type TestProduct } from "./helpers/test-data";

const EMAIL_PRODUCTS: TestProduct[] = [
  {
    id: "email-test-ramen",
    name: "Email Ramen",
    description: "Ramen for email notification test",
    price: 1200,
    image: "",
  },
];

const productIds = EMAIL_PRODUCTS.map((p) => p.id);

async function findFrameInput(page: Page, name: string, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      try {
        const el = await frame.$(`input[name="${name}"]`);
        if (el) return el;
      } catch {
        /* frame not ready */
      }
    }
    await page.waitForTimeout(250);
  }
  throw new Error(`Stripe field "${name}" not found in any frame within ${timeout}ms`);
}

async function fillStripePayment(page: Page) {
  await expect(page.locator('[data-testid="stripe-elements"] iframe')).toBeAttached({ timeout: 30_000 });

  const cardNumber = await findFrameInput(page, "number");
  await cardNumber.fill("4242424242424242");

  const expiry = await findFrameInput(page, "expiry");
  await expiry.fill("1230");

  const cvc = await findFrameInput(page, "cvc");
  await cvc.fill("123");

  try {
    const postalCode = await findFrameInput(page, "postalCode", 3_000);
    await postalCode.fill("10001");
  } catch {
    // Postal code not required for this configuration
  }
}

test.beforeAll(async () => {
  await cleanupProducts(productIds);
  await seedTestProducts(EMAIL_PRODUCTS);
});

test.afterAll(async () => {
  await cleanupProducts(productIds);
});

test("checkout with email: enter email → pay → order complete page shows email sent confirmation", async ({ page }) => {
  // Browse menu and add product to cart
  await page.goto(ROUTES.MENU);
  const product = page.getByTestId("product-card").first();
  await product.click();
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByTestId("added-count")).toHaveText("1");

  // Go to cart then checkout
  await page.getByRole("link", { name: "View Cart" }).click();
  await page.getByRole("link", { name: "Proceed to Checkout" }).click();

  // Fill in email address
  const emailInput = page.getByLabel("Email");
  await expect(emailInput).toBeVisible();
  await emailInput.fill("customer@example.com");

  // Pay with Stripe test card
  await fillStripePayment(page);
  await page.getByRole("button", { name: "Place Order" }).click();

  // Order confirmed with email notification message
  await expect(page).toHaveURL(/\/orders\/.+\/complete/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  await expect(page.getByTestId("payment-status")).toHaveText("Payment Complete");
  await expect(page.getByTestId("email-sent")).toHaveText("Confirmation email sent to customer@example.com");
});
