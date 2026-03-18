import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
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

async function cleanAllTables(pool: pg.Pool) {
  await pool.query(`DELETE FROM "OrderItem"`);
  await pool.query(`DELETE FROM "Order"`);
  await pool.query(`DELETE FROM "Product"`);
  await pool.query(`DELETE FROM "Admin"`);
}

describe("resetDatabase", () => {
  let pool: pg.Pool;

  beforeAll(async () => {
    pool = createPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await cleanAllTables(pool);
  });

  it("should delete all order items", async () => {
    const productId = "test-product-for-order-item";
    await pool.query(
      `INSERT INTO "Product" (id, name, description, price, image, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [productId, "Test Product", "A test product", 100, ""]
    );

    const orderId = "test-order-for-item";
    await pool.query(
      `INSERT INTO "Order" (id, status, total, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [orderId, "pending", 100]
    );

    await pool.query(
      `INSERT INTO "OrderItem" (id, quantity, price, "productId", "orderId")
       VALUES ($1, $2, $3, $4, $5)`,
      ["test-order-item-1", 1, 100, productId, orderId]
    );

    await resetDatabase();

    const result = await pool.query(`SELECT COUNT(*) FROM "OrderItem"`);
    expect(Number(result.rows[0].count)).toBe(0);
  });

  it("should delete all orders", async () => {
    await pool.query(
      `INSERT INTO "Order" (id, status, total, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())`,
      ["test-order-1", "completed", 500]
    );

    await resetDatabase();

    const result = await pool.query(`SELECT COUNT(*) FROM "Order"`);
    expect(Number(result.rows[0].count)).toBe(0);
  });

  it("should delete all existing products", async () => {
    await pool.query(
      `INSERT INTO "Product" (id, name, description, price, image, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      ["old-product-1", "Old Product", "Should be removed", 999, ""]
    );

    await resetDatabase();

    const result = await pool.query(
      `SELECT * FROM "Product" WHERE id = $1`,
      ["old-product-1"]
    );
    expect(result.rows).toHaveLength(0);
  });

  it("should seed demo products", async () => {
    await resetDatabase();

    const result = await pool.query(
      `SELECT name, description, price, image FROM "Product" ORDER BY name`
    );
    expect(result.rows).toHaveLength(DEMO_PRODUCTS.length);

    for (const product of DEMO_PRODUCTS) {
      const matchingRow = result.rows.find(
        (row: { name: string }) => row.name === product.name
      );
      expect(matchingRow).toBeDefined();
      expect(matchingRow.description).toBe(product.description);
      expect(matchingRow.price).toBe(product.price);
      expect(matchingRow.image).toBe(product.image);
    }
  });

  it("should seed demo admin", async () => {
    await resetDatabase();

    const result = await pool.query(
      `SELECT email, "passwordHash" FROM "Admin" WHERE email = $1`,
      [DEMO_ADMIN.email]
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].email).toBe(DEMO_ADMIN.email);
    expect(result.rows[0].passwordHash).toBe(DEMO_ADMIN.passwordHash);
  });
});
