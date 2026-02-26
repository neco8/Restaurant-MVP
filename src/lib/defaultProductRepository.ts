import { getPrisma } from "@/server/prismaClient";
import { createPrismaProductRepository } from "./prismaProductRepository";
import type { ProductRepository } from "./types";

export function defaultProductRepository(): ProductRepository {
  return createPrismaProductRepository(getPrisma());
}
