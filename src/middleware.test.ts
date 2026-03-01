import { vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
}));

import { getSession } from "@/lib/session";
import { middleware } from "@/middleware";

const mockedGetSession = vi.mocked(getSession);

beforeEach(() => {
  mockedGetSession.mockResolvedValue(null);
});

test("redirects unauthenticated requests to /admin to /admin/login", async () => {
  const request = new NextRequest(new URL("http://localhost:3000/admin"));

  const response = await middleware(request);

  expect(response.status).toBe(307);
  expect(response.headers.get("location")).toBe(
    "http://localhost:3000/admin/login"
  );
});

test("does not redirect requests to /admin/login", async () => {
  const request = new NextRequest(
    new URL("http://localhost:3000/admin/login")
  );

  const response = await middleware(request);

  expect(response.status).not.toBe(307);
});

test("does not redirect requests to / (public page)", async () => {
  const request = new NextRequest(new URL("http://localhost:3000/"));

  const response = await middleware(request);

  expect(response.status).not.toBe(307);
});

test("does not redirect authenticated requests to /admin", async () => {
  mockedGetSession.mockResolvedValue({ email: "admin@test.com" });
  const request = new NextRequest(new URL("http://localhost:3000/admin"));

  const response = await middleware(request);

  expect(response.status).not.toBe(307);
});
