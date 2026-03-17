import { createPrismaAdminRepository } from "@/lib/prismaAdminRepository";
import type { AdminRepository } from "@/lib/types";
import { prisma } from "./prismaClient";

export function defaultAdminRepository(): AdminRepository {
  return createPrismaAdminRepository(prisma);
}
