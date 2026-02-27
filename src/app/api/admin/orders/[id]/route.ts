import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function PUT(request: Request, context: RouteParams) {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
