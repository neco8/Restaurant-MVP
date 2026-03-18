import pg from "pg";
import { DEMO_PRODUCTS, DEMO_ADMIN } from "./seed-data";

export async function resetDatabase(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const pool = new pg.Pool({ connectionString });
  try {
    await pool.query(`DELETE FROM "OrderItem"`);
    await pool.query(`DELETE FROM "Order"`);
    await pool.query(`DELETE FROM "Product"`);

    for (const product of DEMO_PRODUCTS) {
      await pool.query(
        `INSERT INTO "Product" (id, name, description, price, image, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [product.id, product.name, product.description, product.price, product.image]
      );
    }

    await pool.query(
      `INSERT INTO "Admin" (id, email, "passwordHash", "createdAt")
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (email) DO UPDATE SET "passwordHash" = $3`,
      ["demo-admin-1", DEMO_ADMIN.email, DEMO_ADMIN.passwordHash]
    );
  } finally {
    await pool.end();
  }
}
