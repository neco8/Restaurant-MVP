import { describe, it, expect, beforeAll, afterAll } from "vitest";
import pg from "pg";
import { resetDatabase } from "../reset-database";
import { DEMO_PRODUCTS, DEMO_ADMIN } from "../seed-data";

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return new pg.Pool({ connectionString });
}

describe("Demo database reset", () => {
  let pool: pg.Pool;

  beforeAll(async () => {
    pool = createPool();

    // Seed existing data so we can verify it gets cleared
    const productId = "test-pre-existing-product";
    await pool.query(
      `INSERT INTO "Product" (id, name, description, price, image, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET name = $2`,
      [productId, "Old Product", "Should be removed", 999, ""]
    );

    const orderId = "test-pre-existing-order";
    await pool.query(
      `INSERT INTO "Order" (id, status, total, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET status = $2`,
      [orderId, "completed", 999]
    );

    await pool.query(
      `INSERT INTO "OrderItem" (id, quantity, price, "productId", "orderId")
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET quantity = $2`,
      ["test-pre-existing-item", 2, 999, productId, orderId]
    );
  });

  afterAll(async () => {
    // Clean up: remove any data left by the test
    await pool.query(`DELETE FROM "OrderItem"`);
    await pool.query(`DELETE FROM "Order"`);
    await pool.query(`DELETE FROM "Product"`);
    await pool.query(`DELETE FROM "Admin"`);
    await pool.end();
  });

  it("should clear all orders and order items, seed signature dishes, and create a demo admin", async () => {
    await resetDatabase();

    // Verify all order items are deleted
    const orderItemsResult = await pool.query(`SELECT COUNT(*) FROM "OrderItem"`);
    expect(Number(orderItemsResult.rows[0].count)).toBe(0);

    // Verify all orders are deleted
    const ordersResult = await pool.query(`SELECT COUNT(*) FROM "Order"`);
    expect(Number(ordersResult.rows[0].count)).toBe(0);

    // Verify exactly 5 demo products are seeded
    const productsResult = await pool.query(
      `SELECT name, description, price, image FROM "Product" ORDER BY name`
    );
    expect(productsResult.rows).toHaveLength(DEMO_PRODUCTS.length);

    // Verify each demo product is present with correct data (price in cents)
    for (const product of DEMO_PRODUCTS) {
      const matchingRow = productsResult.rows.find(
        (row: { name: string }) => row.name === product.name
      );
      expect(matchingRow).toBeDefined();
      expect(matchingRow.description).toBe(product.description);
      expect(matchingRow.price).toBe(product.price);
      expect(matchingRow.image).toBe(product.image);
    }

    // Verify a demo admin account exists
    const adminResult = await pool.query(`SELECT email FROM "Admin"`);
    expect(adminResult.rows.length).toBeGreaterThanOrEqual(1);
    expect(
      adminResult.rows.some((row: { email: string }) => row.email === DEMO_ADMIN.email)
    ).toBe(true);
  });
});
