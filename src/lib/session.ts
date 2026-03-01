import { cookies } from "next/headers";

export async function createSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", email, {});
}

export function getSession(
  request: Request
): { email: string } | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="));

  if (!match) return null;

  const email = match.slice("session=".length);
  return { email };
}
