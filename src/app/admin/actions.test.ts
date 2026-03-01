import { describe, it, expect, vi } from "vitest";

const { mockDestroySession } = vi.hoisted(() => ({
  mockDestroySession: vi.fn(),
}));
vi.mock("@/lib/session", () => ({
  destroySession: mockDestroySession,
}));

import { logout } from "./actions";

describe("logout", () => {
  it("should call destroySession", async () => {
    await logout();

    expect(mockDestroySession).toHaveBeenCalled();
  });
});
