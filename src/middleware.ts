import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest): NextResponse => {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
};
