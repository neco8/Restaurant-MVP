import { vi, afterEach } from "vitest";
import { GET } from "./route";

describe("GET /api/auth/google", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("uses environment variables for client_id and redirect_uri", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id-from-env");
    vi.stubEnv("GOOGLE_REDIRECT_URI", "https://myapp.example.com/api/auth/google/callback");

    const res = await GET();

    const location = res.headers.get("Location");
    const redirectUrl = new URL(location!);

    expect(redirectUrl.searchParams.get("client_id")).toBe("test-client-id-from-env");
    expect(redirectUrl.searchParams.get("redirect_uri")).toBe(
      "https://myapp.example.com/api/auth/google/callback"
    );
  });

  test("includes a state parameter in the redirect URL and sets an oauth_state cookie", async () => {
    const res = await GET();

    const location = res.headers.get("Location");
    const redirectUrl = new URL(location!);
    const state = redirectUrl.searchParams.get("state");
    expect(state).toBeTruthy();

    const setCookie = res.headers.get("Set-Cookie");
    expect(setCookie).toContain("oauth_state=");
    expect(setCookie).toContain(state!);
  });

  test("redirects to Google OAuth authorization URL", async () => {
    const res = await GET();

    expect(res.status).toBe(302);

    const location = res.headers.get("Location");
    expect(location).toBeDefined();

    const redirectUrl = new URL(location!);
    expect(redirectUrl.origin + redirectUrl.pathname).toBe(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
    expect(redirectUrl.searchParams.get("client_id")).toBeTruthy();
    expect(redirectUrl.searchParams.get("redirect_uri")).toBeTruthy();
    expect(redirectUrl.searchParams.get("response_type")).toBe("code");
    expect(redirectUrl.searchParams.get("scope")).toBeTruthy();
  });
});
