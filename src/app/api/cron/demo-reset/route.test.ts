vi.mock("../../../../../scripts/demo/reset-database", () => ({
  resetDatabase: vi.fn(),
}));

import { GET } from "./route";

describe("GET /api/cron/demo-reset", () => {
  test("returns 401 when authorization header is missing", async () => {
    const request = new Request("http://localhost:3000/api/cron/demo-reset");

    const response = await GET(request);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });
});
