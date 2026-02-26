import type { ProductRepository } from "./types";

export type PrismaProductClient = {
  product: {
    findMany: () => Promise<Array<{ id: string; name: string; description: string; price: number }>>;
  };
};

export function createPrismaProductRepository(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prisma: PrismaProductClient
): ProductRepository {
  throw new Error("Not implemented");
}
