import type { ProductRepository } from "./types";
import { price } from "./price";

export type PrismaProductClient = {
  product: {
    findMany: () => Promise<Array<{ id: string; name: string; description: string; price: number }>>;
  };
};

export function createPrismaProductRepository(
  prisma: PrismaProductClient
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
