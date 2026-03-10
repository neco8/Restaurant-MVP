import { GET } from "./route";

describe("GET /api/auth/google", () => {
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
