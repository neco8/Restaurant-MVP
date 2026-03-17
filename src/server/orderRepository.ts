import { createInMemoryOrderRepository } from "@/lib/inMemoryOrderRepository";
import { createPrismaOrderRepository } from "@/lib/prismaOrderRepository";
import type { OrderRepository } from "@/lib/types";
import { prisma } from "./prismaClient";

export function defaultOrderRepository(): OrderRepository {
  if (process.env.DEMO_MODE === "true") {
    return createInMemoryOrderRepository();
  }
  return createPrismaOrderRepository(prisma);
}
