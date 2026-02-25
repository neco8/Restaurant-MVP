import type { ProductRepository } from "../types";
import { prisma } from "./prisma";
import { createPrismaProductRepository } from "./prismaProductRepository";

export function defaultProductRepository(): ProductRepository {
  return createPrismaProductRepository(prisma);
}
