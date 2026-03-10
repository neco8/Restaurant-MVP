import { vi, afterEach } from "vitest";

const mockCreateSession = vi.fn();
const mockExchangeCodeForToken = vi.fn();
const mockFetchUserInfo = vi.fn();

vi.mock("@/server/session", () => ({
  createSession: (...args: unknown[]) => mockCreateSession(...args),
}));

vi.mock("@/lib/google-oauth", () => ({
  exchangeCodeForToken: (...args: unknown[]) =>
    mockExchangeCodeForToken(...args),
  fetchUserInfo: (...args: unknown[]) => mockFetchUserInfo(...args),
}));

import { GET } from "./route";

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/auth/google/callback", () => {
  test("redirects to /admin/login when state param does not match cookie", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/google/callback?code=fake-auth-code&state=request-state",
      {
        headers: {
          Cookie: "oauth_state=different-state",
        },
      }
    );

    const res = await GET(request);

    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toContain("/admin/login");
  });

  test("redirects to /admin/login when code query parameter is missing", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/google/callback"
    );

    const res = await GET(request);

    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toContain("/admin/login");
  });

  test("redirects to /admin/login when token exchange fails", async () => {
    mockExchangeCodeForToken.mockRejectedValueOnce(
      new Error("Token exchange failed")
    );

    const request = new Request(
      "http://localhost:3000/api/auth/google/callback?code=fake-auth-code&state=matching-state",
      {
        headers: {
          Cookie: "oauth_state=matching-state",
        },
      }
    );

    const res = await GET(request);

    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toContain("/admin/login");
  });

  test("redirects to /admin after receiving a valid authorization code", async () => {
    mockExchangeCodeForToken.mockResolvedValueOnce({
      access_token: "fake-access-token",
    });
    mockFetchUserInfo.mockResolvedValueOnce({
      email: "owner@restaurant.com",
    });
    mockCreateSession.mockResolvedValue(undefined);

    const request = new Request(
      "http://localhost:3000/api/auth/google/callback?code=fake-auth-code&state=matching-state",
      {
        headers: {
          Cookie: "oauth_state=matching-state",
        },
      }
    );

    const res = await GET(request);

    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toContain("/admin");
    expect(mockExchangeCodeForToken).toHaveBeenCalledWith("fake-auth-code");
    expect(mockFetchUserInfo).toHaveBeenCalledWith("fake-access-token");
    expect(mockCreateSession).toHaveBeenCalledWith("owner@restaurant.com");
  });
});
