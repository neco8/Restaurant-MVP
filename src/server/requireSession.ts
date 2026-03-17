import { NextResponse } from "next/server";
import { getSession } from "@/server/session";
import { defaultAdminRepository } from "@/server/adminRepository";

export async function requireSession(
  request: Request
): Promise<{ email: string; adminId: string } | Response> {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await defaultAdminRepository().findByEmail(session.email);

  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { email: session.email, adminId: admin.id };
}
