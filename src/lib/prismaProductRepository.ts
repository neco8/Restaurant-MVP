import type { PrismaClient } from "@/generated/prisma/client";
import type { ProductRepository } from "./types";
import { price } from "./price";

export function createPrismaProductRepository(
  prisma: PrismaClient
): ProductRepository {
  return {
    findAll: async () => {
      const rows = await prisma.product.findMany();
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: price(row.price / 100),
      }));
    },
  };
}
