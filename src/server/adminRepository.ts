import { createInMemoryAdminRepository } from "@/lib/inMemoryAdminRepository";
import { createPrismaAdminRepository } from "@/lib/prismaAdminRepository";
import type { AdminRepository } from "@/lib/types";
import { prisma } from "./prismaClient";

export function defaultAdminRepository(): AdminRepository {
  if (process.env.DEMO_MODE === "true") {
    return createInMemoryAdminRepository([]);
  }
  return createPrismaAdminRepository(prisma);
}
