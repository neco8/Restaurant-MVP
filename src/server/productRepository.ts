import { createPrismaProductRepository } from "@/lib/prismaProductRepository";
import type { ProductRepository } from "@/lib/types";
import { demoProductRepository, isDemoMode } from "./demoRepositories";
import { prisma } from "./prismaClient";

export function defaultProductRepository(): ProductRepository {
  if (isDemoMode()) {
    return demoProductRepository();
  }
  return createPrismaProductRepository(prisma);
}
