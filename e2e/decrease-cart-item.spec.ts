import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/routes";
import { seedTestProducts, cleanupProducts, type TestProduct } from "./helpers/test-data";

const DECREASE_CART_PRODUCTS: TestProduct[] = [
  {
    id: "decrease-cart-test-product",
    name: "Decrease Cart Test Ramen",
    description: "Ramen for decrease cart item test",
    price: 900,
    image: "",
  },
];

const productIds = DECREASE_CART_PRODUCTS.map((p) => p.id);

test.beforeAll(async () => {
  await cleanupProducts(productIds);
  await seedTestProducts(DECREASE_CART_PRODUCTS);
});

test.afterAll(async () => {
  await cleanupProducts(productIds);
});

test("cart: add items → decrease quantity → item removed when quantity reaches zero", async ({
  page,
}) => {
  // Browse menu and select a product
  await page.goto(ROUTES.MENU);
  const firstProduct = page.getByTestId("product-card").first();
  const productName = await firstProduct.getByTestId("product-name").textContent();
  await firstProduct.click();

  // Add product to cart twice (quantity = 2)
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByTestId("added-count")).toHaveText("1");
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByTestId("added-count")).toHaveText("2");

  // Navigate to cart
  await page.getByRole("link", { name: "View Cart" }).click();
  await expect(page.getByText(productName!)).toBeVisible();
  await expect(page.getByText("×2")).toBeVisible();

  // Decrease quantity from 2 to 1
  await page.getByRole("button", { name: "Decrease quantity" }).click();
  await expect(page.getByText("×2")).not.toBeVisible();
  await expect(page.getByText(productName!)).toBeVisible();

  // Decrease quantity from 1 to 0 — item is removed
  await page.getByRole("button", { name: "Decrease quantity" }).click();
  await expect(page.getByText(productName!)).not.toBeVisible();
  await expect(page.getByText("Your cart is empty")).toBeVisible();
});
