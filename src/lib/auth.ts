import bcrypt from "bcryptjs";
import { findAdminByEmail } from "@/lib/admin-repository";

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const admin = await findAdminByEmail(email);
  if (!admin) {
    return false;
  }
  return bcrypt.compare(password, admin.passwordHash);
}
