import pg from "pg";

export type TestProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export const TEST_PRODUCTS: TestProduct[] = [
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
  products: TestProduct[]
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

export async function cleanupProducts(ids: string[]): Promise<void> {
  const pool = createPool();
  try {
    await pool.query(
      `DELETE FROM "Product" WHERE id = ANY($1)`,
      [ids]
    );
  } finally {
    await pool.end();
  }
}

export async function cleanupProductsByName(names: string[]): Promise<void> {
  const pool = createPool();
  try {
    await pool.query(
      `DELETE FROM "Product" WHERE name = ANY($1)`,
      [names]
    );
  } finally {
    await pool.end();
  }
}

export type TestOrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number; // in cents
};

export type TestOrder = {
  id: string;
  status: string;
  total: number; // in cents
  items: TestOrderItem[];
};

export async function seedTestOrders(orders: TestOrder[]): Promise<void> {
  const pool = createPool();
  try {
    for (const order of orders) {
      await pool.query(
        `INSERT INTO "Order" (id, status, total, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET status = $2, total = $3, "updatedAt" = NOW()`,
        [order.id, order.status, order.total]
      );
      for (const item of order.items) {
        await pool.query(
          `INSERT INTO "OrderItem" (id, quantity, price, "productId", "orderId")
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET quantity = $2, price = $3`,
          [item.id, item.quantity, item.price, item.productId, order.id]
        );
      }
    }
  } finally {
    await pool.end();
  }
}

export async function cleanupOrders(ids: string[]): Promise<void> {
  const pool = createPool();
  try {
    await pool.query(`DELETE FROM "OrderItem" WHERE "orderId" = ANY($1)`, [ids]);
    await pool.query(`DELETE FROM "Order" WHERE id = ANY($1)`, [ids]);
  } finally {
    await pool.end();
  }
}
