import { createPrismaProductRepository } from "@/lib/prismaProductRepository";
import type { ProductRepository } from "@/lib/types";
import { prisma } from "./prismaClient";

export function defaultProductRepository(): ProductRepository {
  return createPrismaProductRepository(prisma);
}
