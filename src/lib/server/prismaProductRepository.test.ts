import { createPrismaProductRepository } from "./prismaProductRepository";
import type { PrismaClient } from "@/generated/prisma/client";

function mockPrisma(products: Array<{ id: string; name: string; description: string; price: number }>) {
  return {
    product: { findMany: async () => products },
  } as unknown as PrismaClient;
}

test("findAll returns empty list when no products", async () => {
  const repository = createPrismaProductRepository(mockPrisma([]));
  const result = await repository.findAll();
  expect(result).toEqual([]);
});
