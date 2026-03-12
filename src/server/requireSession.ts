import { NextResponse } from "next/server";
import { getSession } from "@/server/session";
import { prisma } from "@/server/prismaClient";

export async function requireSession(
  request: Request
): Promise<{ email: string; adminId: string } | Response> {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await prisma.admin.findUnique({
    where: { email: session.email },
  });

  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { email: session.email, adminId: admin.id };
}
