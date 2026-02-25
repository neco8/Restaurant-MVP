import { describe, it, expect } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";

const mockProducts = [
  { id: "1", name: "Ramen", description: "Rich tonkotsu broth", price: 1200, image: "", createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Gyoza", description: "Pan-fried dumplings", price: 750, image: "", createdAt: new Date(), updatedAt: new Date() },
];

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    product: {
      findMany: async () => mockProducts,
    },
  } as unknown as PrismaClient,
}));

describe("GET /api/products (integration)", () => {
  it("returns products seeded in the database with price converted from cents to dollars", async () => {
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
