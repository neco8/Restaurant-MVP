import { price } from "./price";
import type { CreateProductInput, Product, ProductRepository, UpdateProductInput } from "./types";

export type PrismaProductRow = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type PrismaProductDelegate = {
  findMany: () => Promise<PrismaProductRow[]>;
  findUnique: (args: { where: { id: string } }) => Promise<PrismaProductRow | null>;
  create: (args: { data: { name: string; description: string; price: number } }) => Promise<PrismaProductRow>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<PrismaProductRow>;
  delete: (args: { where: { id: string } }) => Promise<PrismaProductRow>;
};

export type PrismaLike = {
  product: PrismaProductDelegate;
};

function toDomain(row: PrismaProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: price(row.price / 100),
  };
}

export function createPrismaProductRepository(
  prisma: PrismaLike
): ProductRepository {
  return {
    findAll: async (): Promise<Product[]> => {
      const rows = await prisma.product.findMany();
      return rows.map(toDomain);
    },
    findById: async (id: string): Promise<Product | null> => {
      const row = await prisma.product.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    },
    create: async (input: CreateProductInput): Promise<Product> => {
      const row = await prisma.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: Math.round(input.price * 100),
        },
      });
      return toDomain(row);
    },
    update: async (id: string, input: UpdateProductInput): Promise<Product> => {
      const data: Record<string, unknown> = {};
      if (input.name !== undefined) data.name = input.name;
      if (input.description !== undefined) data.description = input.description;
      if (input.price !== undefined) data.price = Math.round(input.price * 100);
      const row = await prisma.product.update({ where: { id }, data });
      return toDomain(row);
    },
    delete: async (id: string): Promise<void> => {
      await prisma.product.delete({ where: { id } });
    },
  };
}
