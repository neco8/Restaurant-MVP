import type { ProductRepository } from "../types";
import type { PrismaClient } from "@/generated/prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createPrismaProductRepository(prisma: PrismaClient): ProductRepository {
  throw new Error("Not implemented");
}
