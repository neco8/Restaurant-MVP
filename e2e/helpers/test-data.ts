import pg from "pg";

export const TEST_PRODUCTS = [
  {
    id: "test-product-ramen",
    name: "Test Ramen",
    description: "Test ramen description",
    price: 1200,
    image: "",
  },
  {
    id: "test-product-gyoza",
    name: "Test Gyoza",
    description: "Test gyoza description",
    price: 750,
    image: "",
  },
  {
    id: "test-product-takoyaki",
    name: "Test Takoyaki",
    description: "Test takoyaki description",
    price: 800,
    image: "",
  },
];

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return new pg.Pool({ connectionString });
}

export async function seedTestProducts(
  products: typeof TEST_PRODUCTS
): Promise<void> {
  const pool = createPool();
  try {
    for (const product of products) {
      await pool.query(
        `INSERT INTO "Product" (id, name, description, price, image, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET name = $2, description = $3, price = $4, image = $5, "updatedAt" = NOW()`,
        [product.id, product.name, product.description, product.price, product.image]
      );
    }
  } finally {
    await pool.end();
  }
}

export async function cleanupTestProducts(): Promise<void> {
  const pool = createPool();
  try {
    const ids = TEST_PRODUCTS.map((p) => p.id);
    await pool.query(
      `DELETE FROM "Product" WHERE id = ANY($1)`,
      [ids]
    );
  } finally {
    await pool.end();
  }
}
