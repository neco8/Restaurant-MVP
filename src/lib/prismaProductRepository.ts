import { fromCents } from "./cents";
import { price } from "./price";
import type { Product, ProductRepository } from "./types";

export type PrismaProductRow = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type PrismaProductDelegate = {
  findMany: () => Promise<PrismaProductRow[]>;
};

export type PrismaLike = {
  product: PrismaProductDelegate;
};

export function createPrismaProductRepository(
  prisma: PrismaLike
): ProductRepository {
  return {
    findAll: async (): Promise<Product[]> => {
      const rows = await prisma.product.findMany();
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: price(fromCents(row.price)),
      }));
    },
  };
}
