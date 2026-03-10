import { vi, afterEach } from "vitest";
import {
  buildGoogleAuthUrl,
  exchangeCodeForToken,
  fetchUserInfo,
} from "./google-oauth";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("buildGoogleAuthUrl", () => {
  test("returns URL with all required OAuth params", () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
    vi.stubEnv("GOOGLE_REDIRECT_URI", "https://example.com/callback");

    const url = new URL(buildGoogleAuthUrl("test-state"));

    expect(url.origin + url.pathname).toBe(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
    expect(url.searchParams.get("client_id")).toBe("test-client-id");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://example.com/callback"
    );
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toBe("openid email profile");
    expect(url.searchParams.get("state")).toBe("test-state");
  });
});

describe("exchangeCodeForToken", () => {
  test("calls Google token endpoint and returns access token", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-client-secret");
    vi.stubEnv("GOOGLE_REDIRECT_URI", "https://example.com/callback");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "fake-access-token" }),
    });

    const result = await exchangeCodeForToken("auth-code-123");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "auth-code-123",
          client_id: "test-client-id",
          client_secret: "test-client-secret",
          redirect_uri: "https://example.com/callback",
          grant_type: "authorization_code",
        }),
      }
    );
    expect(result).toEqual({ access_token: "fake-access-token" });
  });

  test("throws when token exchange fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    await expect(exchangeCodeForToken("bad-code")).rejects.toThrow(
      "Token exchange failed"
    );
  });
});

describe("fetchUserInfo", () => {
  test("calls Google userinfo endpoint and returns email", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ email: "user@example.com" }),
    });

    const result = await fetchUserInfo("access-token-123");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: "Bearer access-token-123" },
      }
    );
    expect(result).toEqual({ email: "user@example.com" });
  });
});
