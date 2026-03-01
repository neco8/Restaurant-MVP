import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/session";

export const config = {
  matcher: ["/admin/:path*"],
};

export const middleware = async (request: NextRequest): Promise<NextResponse> => {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return NextResponse.next();
};
