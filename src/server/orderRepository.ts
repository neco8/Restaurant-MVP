import { createPrismaOrderRepository } from "@/lib/prismaOrderRepository";
import type { OrderRepository } from "@/lib/types";
import { demoOrderRepository, isDemoMode } from "./demoRepositories";
import { prisma } from "./prismaClient";

export function defaultOrderRepository(): OrderRepository {
  if (isDemoMode()) {
    return demoOrderRepository();
  }
  return createPrismaOrderRepository(prisma);
}
