import { centsToDollars, dollarsToCents } from "./currency";
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
  findUnique: (args: { where: { id: string } }) => Promise<PrismaProductRow | null>;
  create: (args: { data: { name: string; description: string; price: number; image: string } }) => Promise<PrismaProductRow>;
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
        price: price(centsToDollars(row.price)),
      }));
    },
    findById: async (id: string): Promise<Product | null> => {
      const row = await prisma.product.findUnique({ where: { id } });
      if (!row) return null;
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: price(centsToDollars(row.price)),
      };
    },
    create: async (input): Promise<Product> => {
      const priceInCents = dollarsToCents(input.price);
      const row = await prisma.product.create({
        data: { name: input.name, description: input.description, price: priceInCents, image: "" },
      });
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: price(centsToDollars(row.price)),
      };
    },
  };
}
