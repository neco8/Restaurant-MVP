import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest): NextResponse => {
  return NextResponse.redirect(new URL("/admin/login", request.url));
};
