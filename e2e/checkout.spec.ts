import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";
import { seedTestProducts, cleanupProducts, type TestProduct } from "./helpers/test-data";

const CHECKOUT_PRODUCTS: TestProduct[] = [
  {
    id: "checkout-test-ramen",
    name: "Checkout Ramen",
    description: "Ramen for checkout test",
    price: 1200,
    image: "",
  },
  {
    id: "checkout-test-gyoza",
    name: "Checkout Gyoza",
    description: "Gyoza for checkout test",
    price: 750,
    image: "",
  },
];

const productIds = CHECKOUT_PRODUCTS.map((p) => p.id);

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

  // PaymentElement may show a postal code field for US currency
  try {
    const postalCode = await findFrameInput(page, "postalCode", 3_000);
    await postalCode.fill("10001");
  } catch {
    // Postal code not required for this configuration
  }
}

test.beforeAll(async () => {
  await cleanupProducts(productIds);
  await seedTestProducts(CHECKOUT_PRODUCTS);
});

test.afterAll(async () => {
  await cleanupProducts(productIds);
});

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

  // Verify order summary shows the added product
  await expect(page.getByRole("heading", { name: "Order Summary" })).toBeVisible();
  await expect(page.getByText(productName!)).toBeVisible();
  await expect(page.getByTestId("checkout-total")).toBeVisible();

  // Pay with Stripe test card
  await fillStripePayment(page);
  await page.getByRole("button", { name: "Place Order" }).click();

  // Order confirmed
  await expect(page).toHaveURL(/\/orders\/.+\/complete/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  await expect(page.getByTestId("payment-status")).toHaveText("Payment Complete");

  // Cart is empty after successful payment
  await page.goto(ROUTES.CHECKOUT);
  await expect(page.getByText("Your cart is empty")).toBeVisible();
});
