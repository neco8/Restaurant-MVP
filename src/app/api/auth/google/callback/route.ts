import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.json({ message: "not implemented", path: url.pathname });
}
