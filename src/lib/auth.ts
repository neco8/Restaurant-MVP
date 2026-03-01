import bcrypt from "bcryptjs";
import { findAdminByEmail } from "@/lib/admin-repository";

type PrismaClient = {
  readonly admin: {
    readonly findUnique: (args: {
      readonly where: { readonly email: string };
    }) => Promise<{ readonly id: string; readonly email: string; readonly passwordHash: string } | null>;
  };
};

export async function verifyAdminCredentials(
  prisma: PrismaClient,
  email: string,
  password: string
): Promise<boolean> {
  const admin = await findAdminByEmail(prisma, email);
  if (!admin) {
    return false;
  }
  return bcrypt.compare(password, admin.passwordHash);
}
