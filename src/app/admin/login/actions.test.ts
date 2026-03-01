import { describe, it, expect } from "vitest";
import { login } from "./actions";

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
});
