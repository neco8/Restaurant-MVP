import { GET } from "./route";

const mockCreateSession = vi.fn();

vi.mock("@/server/session", () => ({
  createSession: (...args: unknown[]) => mockCreateSession(...args),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/auth/google/callback", () => {
  test("redirects to /admin/login when code query parameter is missing", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/google/callback"
    );

    const res = await GET(request);

    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toContain("/admin/login");
  });

  test("redirects to /admin after receiving a valid authorization code", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: "fake-access-token",
          id_token: "fake-id-token",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          email: "owner@restaurant.com",
        }),
      });

    mockCreateSession.mockResolvedValue(undefined);

    const request = new Request(
      "http://localhost:3000/api/auth/google/callback?code=fake-auth-code"
    );

    const res = await GET(request);

    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toContain("/admin");
  });
});
