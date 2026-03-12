import { vi, afterEach } from "vitest";

const mockBuildGoogleAuthUrl = vi.fn();

vi.mock("@/lib/google-oauth", () => ({
  buildGoogleAuthUrl: (...args: unknown[]) => mockBuildGoogleAuthUrl(...args),
}));

import { GET } from "./route";

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/auth/google", () => {
  test("redirects to the URL built by buildGoogleAuthUrl", async () => {
    mockBuildGoogleAuthUrl.mockReturnValue(
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=test&response_type=code&scope=openid+email+profile&state=some-state"
    );

    const res = await GET();

    expect(res.status).toBe(302);
    const location = res.headers.get("Location");
    expect(location).toContain("https://accounts.google.com/o/oauth2/v2/auth");
  });

  test("passes a state parameter to buildGoogleAuthUrl", async () => {
    mockBuildGoogleAuthUrl.mockReturnValue("https://accounts.google.com/o/oauth2/v2/auth?state=test");

    await GET();

    expect(mockBuildGoogleAuthUrl).toHaveBeenCalledWith(expect.any(String));
    const state = mockBuildGoogleAuthUrl.mock.calls[0][0];
    expect(state).toBeTruthy();
  });

  test("sets an oauth_state cookie matching the state passed to buildGoogleAuthUrl", async () => {
    mockBuildGoogleAuthUrl.mockReturnValue("https://accounts.google.com/o/oauth2/v2/auth?state=test");

    const res = await GET();

    const state = mockBuildGoogleAuthUrl.mock.calls[0][0];
    const setCookie = res.headers.get("Set-Cookie");
    expect(setCookie).toContain("oauth_state=");
    expect(setCookie).toContain(state);
  });
});
