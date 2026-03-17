import { createInMemoryProductRepository } from "@/lib/inMemoryProductRepository";
import { createPrismaProductRepository } from "@/lib/prismaProductRepository";
import type { ProductRepository } from "@/lib/types";
import { prisma } from "./prismaClient";

export function defaultProductRepository(): ProductRepository {
  if (process.env.DEMO_MODE === "true") {
    return createInMemoryProductRepository([]);
  }
  return createPrismaProductRepository(prisma);
}
