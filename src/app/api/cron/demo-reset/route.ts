import { NextResponse } from "next/server";
import { resetDatabase } from "../../../../../scripts/demo/reset-database";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await resetDatabase();
  return NextResponse.json({ ok: true });
}
