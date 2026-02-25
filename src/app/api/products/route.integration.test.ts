import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import pg from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createTestPrisma() {
  const pool = new pg.Pool({
    connectionString: "postgresql://restaurant:restaurant@localhost:5432/restaurant_test",
  });
  const adapter = new PrismaPg(pool);
  return { prisma: new PrismaClient({ adapter }), pool };
}

describe("GET /api/products (integration)", () => {
  let prisma: PrismaClient;
  let pool: pg.Pool;

  beforeAll(async () => {
    const ctx = createTestPrisma();
    prisma = ctx.prisma;
    pool = ctx.pool;
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it("returns products seeded in the database", async () => {
    await prisma.product.create({
      data: { name: "Ramen", description: "Rich tonkotsu broth", price: 1200 },
    });
    await prisma.product.create({
      data: { name: "Gyoza", description: "Pan-fried dumplings", price: 750 },
    });

    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Ramen", price: 12.0 }),
        expect.objectContaining({ name: "Gyoza", price: 7.5 }),
      ])
    );
  });
});
