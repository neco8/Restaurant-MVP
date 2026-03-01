import { verifyAdminCredentials } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { prisma } from "@/server/prismaClient";

type LoginResult =
  | { readonly success: true }
  | { readonly success: false; readonly error: string };

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  if (await verifyAdminCredentials(prisma, credentials.email, credentials.password)) {
    await createSession();
    return { success: true };
  }
  return { success: false, error: "Invalid email or password" };
}
