import { cookies } from "next/headers";

export async function createSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", email, {});
}

export async function getSession(
  _request: Request
): Promise<{ email: string } | null> {
  return null;
}
