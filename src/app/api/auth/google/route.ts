import { NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "@/lib/google-oauth";

export async function GET() {
  const state = crypto.randomUUID();

  const url = buildGoogleAuthUrl(state);

  const response = NextResponse.redirect(url, 302);
  response.cookies.set("oauth_state", state);

  return response;
}
