import { describe, it, expect, vi } from "vitest";

const { mockDestroySession, mockRedirect } = vi.hoisted(() => ({
  mockDestroySession: vi.fn(),
  mockRedirect: vi.fn(),
}));
vi.mock("@/server/session", () => ({
  destroySession: mockDestroySession,
}));
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

import { logout } from "./actions";

describe("logout", () => {
  it("should call destroySession and redirect to login", async () => {
    await logout();

    expect(mockDestroySession).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/admin/login");
  });
});
