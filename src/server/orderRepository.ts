import { createPrismaOrderRepository } from "@/lib/prismaOrderRepository";
import type { OrderRepository } from "@/lib/types";
import { prisma } from "./prismaClient";

export function defaultOrderRepository(): OrderRepository {
  return createPrismaOrderRepository(prisma);
}
