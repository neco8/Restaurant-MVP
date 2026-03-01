import { test, expect } from "@playwright/test";
import {
  seedTestProducts,
  cleanupProducts,
  cleanupProductsByName,
  type TestProduct,
} from "./helpers/test-data";
import { ensureAdminSeeded, loginAsAdmin } from "./helpers/admin-login";

// ── Isolated test data per group ──────────────────────────────────

const DISPLAY_PRODUCTS: TestProduct[] = [
  {
    id: "admin-display-ramen",
    name: "Admin Display Ramen",
    description: "Ramen for admin display test",
    price: 1200,
    image: "",
  },
  {
    id: "admin-display-gyoza",
    name: "Admin Display Gyoza",
    description: "Gyoza for admin display test",
    price: 750,
    image: "",
  },
];

const EDIT_PRODUCT: TestProduct = {
  id: "admin-edit-curry",
  name: "Admin Edit Curry",
  description: "Curry for admin edit test",
  price: 1100,
  image: "",
};

const EDITED_NAME = "Admin Edited Curry";

const DELETE_PRODUCT: TestProduct = {
  id: "admin-delete-udon",
  name: "Admin Delete Udon",
  description: "Udon for admin delete test",
  price: 950,
  image: "",
};

const ADD_PRODUCT_NAME = "Admin Add Tempura";

// ── Display ───────────────────────────────────────────────────────

test.describe("Admin Product Display", () => {
  const productIds = DISPLAY_PRODUCTS.map((p) => p.id);

  test.beforeAll(async () => {
    await ensureAdminSeeded();
    await cleanupProducts(productIds);
    await seedTestProducts(DISPLAY_PRODUCTS);
  });

  test.afterAll(async () => {
    await cleanupProducts(productIds);

  });

  test("displays products in the admin product list", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products");

    for (const product of DISPLAY_PRODUCTS) {
      await expect(
        page.getByRole("cell", { name: product.name, exact: true })
      ).toBeVisible();
    }
  });
});

// ── Add ───────────────────────────────────────────────────────────

test.describe("Admin Product Add", () => {
  test.beforeAll(async () => {
    await ensureAdminSeeded();
    await cleanupProductsByName([ADD_PRODUCT_NAME]);
  });

  test.afterAll(async () => {
    await cleanupProductsByName([ADD_PRODUCT_NAME]);

  });

  test("adds a new product via the admin form", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products/new");

    await page.getByLabel("Name").fill(ADD_PRODUCT_NAME);
    await page.getByLabel("Description").fill("Crispy tempura for testing");
    await page.getByLabel("Price").fill("14.50");
    await page.getByRole("button", { name: "Create Product" }).click();

    await expect(page).toHaveURL("/admin/products");
    await expect(
      page.getByRole("cell", { name: ADD_PRODUCT_NAME, exact: true })
    ).toBeVisible();
  });
});

// ── Edit ──────────────────────────────────────────────────────────

test.describe("Admin Product Edit", () => {
  test.beforeAll(async () => {
    await ensureAdminSeeded();
    await cleanupProducts([EDIT_PRODUCT.id]);
    await cleanupProductsByName([EDITED_NAME]);
    await seedTestProducts([EDIT_PRODUCT]);
  });

  test.afterAll(async () => {
    await cleanupProducts([EDIT_PRODUCT.id]);
    await cleanupProductsByName([EDITED_NAME]);

  });

  test("edits an existing product via the admin form", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products");

    await page
      .getByRole("link", { name: `Edit ${EDIT_PRODUCT.name}` })
      .click();

    await expect(page.getByLabel("Name")).toHaveValue(EDIT_PRODUCT.name);

    await page.getByLabel("Name").clear();
    await page.getByLabel("Name").fill(EDITED_NAME);
    await page.getByRole("button", { name: "Update Product" }).click();

    await expect(page).toHaveURL("/admin/products");
    await expect(
      page.getByRole("cell", { name: EDITED_NAME, exact: true })
    ).toBeVisible();
  });
});

// ── Delete ────────────────────────────────────────────────────────

test.describe("Admin Product Delete", () => {
  test.beforeAll(async () => {
    await ensureAdminSeeded();
    await cleanupProducts([DELETE_PRODUCT.id]);
    await seedTestProducts([DELETE_PRODUCT]);
  });

  test.afterAll(async () => {
    await cleanupProducts([DELETE_PRODUCT.id]);

  });

  test("deletes a product from the admin list", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products");

    await expect(
      page.getByRole("cell", { name: DELETE_PRODUCT.name, exact: true })
    ).toBeVisible();

    await page
      .getByRole("button", { name: `Delete ${DELETE_PRODUCT.name}` })
      .click();

    await expect(
      page.getByRole("cell", { name: DELETE_PRODUCT.name, exact: true })
    ).not.toBeVisible();
  });
});
