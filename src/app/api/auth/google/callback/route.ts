import { NextResponse } from "next/server";
import { createSession } from "@/server/session";
import { exchangeCodeForToken, fetchUserInfo } from "@/lib/google-oauth";
import { prisma } from "@/server/prismaClient";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 302);
  }

  const state = url.searchParams.get("state");
  const cookieHeader = request.headers.get("Cookie") || "";
  const oauthStateCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("oauth_state="));
  const cookieState = oauthStateCookie?.split("=")[1];

  if (!state || state !== cookieState) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 302);
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const userinfo = await fetchUserInfo(tokenData.access_token);

    const admin = await prisma.admin.findUnique({
      where: { email: userinfo.email },
    });

    if (!admin) {
      return NextResponse.redirect(
        new URL("/admin/login?error=unauthorized", request.url),
        302
      );
    }

    await createSession(userinfo.email);

    return NextResponse.redirect(new URL("/admin", request.url), 302);
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url), 302);
  }
}
