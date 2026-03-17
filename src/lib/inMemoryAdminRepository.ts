import type { Admin, AdminRepository } from "./types";

export function createInMemoryAdminRepository(admins: Admin[]): AdminRepository {
  return {
    findByEmail: async (email: string): Promise<Admin | null> => {
      return admins.find((a) => a.email === email) ?? null;
    },
  };
}
