import type { PrismaClient } from "@/generated/prisma/client";
import type { ProductRepository } from "./types";

export function createPrismaProductRepository(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prisma: PrismaClient
): ProductRepository {
  return {
    findAll: async () => [],
  };
}
