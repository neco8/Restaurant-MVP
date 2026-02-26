import { price } from "./price";
import type { CreateProductInput, Product, ProductRepository } from "./types";

export type PrismaProductRow = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type PrismaProductDelegate = {
  findMany: () => Promise<PrismaProductRow[]>;
  create: (args: { data: { name: string; description: string; price: number } }) => Promise<PrismaProductRow>;
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
        price: price(row.price / 100),
      }));
    },
    create: async (input: CreateProductInput): Promise<Product> => {
      const row = await prisma.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: Math.round(input.price * 100),
        },
      });
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: price(row.price / 100),
      };
    },
  };
}
