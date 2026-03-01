import { describe, it, expect, vi } from "vitest";
import { login } from "./actions";

vi.mock("@/server/prismaClient", () => ({
  prisma: {},
}));

vi.mock("@/lib/auth", () => ({
  verifyAdminCredentials: vi.fn(
    async (_prisma: unknown, email: string, password: string): Promise<boolean> =>
      email === "admin@restaurant.com" && password === "correct-password"
  ),
}));

const { mockCreateSession } = vi.hoisted(() => ({
  mockCreateSession: vi.fn(),
}));
vi.mock("@/lib/session", () => ({
  createSession: mockCreateSession,
}));

describe("login", () => {
  it("should return error when credentials are invalid", async () => {
    const result = await login({
      email: "nobody@example.com",
      password: "wrong-password",
    });

    expect(result).toEqual({
      success: false,
      error: "Invalid email or password",
    });
  });

  it("should return success when credentials are valid", async () => {
    const result = await login({
      email: "admin@restaurant.com",
      password: "correct-password",
    });

    expect(result).toEqual({ success: true });
  });

  it("should create a session when credentials are valid", async () => {
    await login({
      email: "admin@restaurant.com",
      password: "correct-password",
    });

    expect(mockCreateSession).toHaveBeenCalledWith("admin@restaurant.com");
  });
});
