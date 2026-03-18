vi.mock("../../../../../scripts/demo/reset-database", () => ({
  resetDatabase: vi.fn(),
}));

import { GET } from "./route";
import { resetDatabase } from "../../../../../scripts/demo/reset-database";

const mockResetDatabase = vi.mocked(resetDatabase);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CRON_SECRET", "test-secret");
});

describe("GET /api/cron/demo-reset", () => {
  test("returns 401 when authorization header is missing", async () => {
    const request = new Request("http://localhost:3000/api/cron/demo-reset");

    const response = await GET(request);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  test("calls resetDatabase and returns ok when authorized", async () => {
    mockResetDatabase.mockResolvedValue(undefined);
    const request = new Request("http://localhost:3000/api/cron/demo-reset", {
      headers: { authorization: "Bearer test-secret" },
    });

    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ ok: true });
    expect(mockResetDatabase).toHaveBeenCalledOnce();
  });
});
