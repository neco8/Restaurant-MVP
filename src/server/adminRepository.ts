import { createPrismaAdminRepository } from "@/lib/prismaAdminRepository";
import type { AdminRepository } from "@/lib/types";
import { demoAdminRepository, isDemoMode } from "./demoRepositories";
import { prisma } from "./prismaClient";

export function defaultAdminRepository(): AdminRepository {
  if (isDemoMode()) {
    return demoAdminRepository();
  }
  return createPrismaAdminRepository(prisma);
}
