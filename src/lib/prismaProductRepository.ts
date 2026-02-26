import type { ProductRepository } from "./types";

export type PrismaProductDelegate = {
  findMany: () => Promise<unknown[]>;
};

export type PrismaLike = {
  product: PrismaProductDelegate;
};

export function createPrismaProductRepository(
  prisma: PrismaLike
): ProductRepository {
  void prisma;
  return {
    findAll: async () => [],
  };
}
