import type { Admin, AdminRepository } from "./types";

export type PrismaAdminRow = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export type PrismaAdminDelegate = {
  findUnique: (args: {
    where: { email: string };
  }) => Promise<PrismaAdminRow | null>;
};

export type PrismaAdminLike = {
  admin: PrismaAdminDelegate;
};

export function createPrismaAdminRepository(
  prisma: PrismaAdminLike
): AdminRepository {
  return {
    findByEmail: async (email: string): Promise<Admin | null> => {
      const row = await prisma.admin.findUnique({ where: { email } });
      if (!row) return null;
      return { id: row.id, email: row.email };
    },
  };
}
