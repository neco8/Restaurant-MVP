import { NextResponse } from "next/server";

export async function GET() {
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "placeholder",
    redirect_uri: "http://localhost:3000/api/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const response = NextResponse.redirect(url, 302);
  response.cookies.set("oauth_state", state);

  return response;
}
