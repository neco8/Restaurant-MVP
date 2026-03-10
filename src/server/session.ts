import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function createSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
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

export function requireSession(
  request: Request
): { email: string } | Response {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
