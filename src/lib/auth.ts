import { findAdminByEmail } from "@/lib/admin-repository";

export async function verifyAdminCredentials(
  email: string,
  _password: string
): Promise<boolean> {
  await findAdminByEmail(email);
  return false;
}
