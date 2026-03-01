import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

test("redirects unauthenticated requests to /admin to /admin/login", () => {
  const request = new NextRequest(new URL("http://localhost:3000/admin"));

  const response = middleware(request);

  expect(response.status).toBe(307);
  expect(response.headers.get("location")).toBe(
    "http://localhost:3000/admin/login"
  );
});

test("does not redirect requests to /admin/login", () => {
  const request = new NextRequest(
    new URL("http://localhost:3000/admin/login")
  );

  const response = middleware(request);

  expect(response.status).not.toBe(307);
});
