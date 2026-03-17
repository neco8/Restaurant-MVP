import { describe, it, expect } from "vitest";

const mockResetDemo = vi.fn();
vi.mock("@/lib/resetDemo", () => ({
  resetDemo: mockResetDemo,
}));

vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: () => ({}),
}));

describe("POST /api/reset-demo", () => {
  it("calls resetDemo and returns 200", async () => {
    mockResetDemo.mockResolvedValue(undefined);
    const { POST } = await import("./route");
    const response = await POST();
    expect(mockResetDemo).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });
});
