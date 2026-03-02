import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib", async () => {
  const actual = await vi.importActual<typeof import("@/lib")>("@/lib");
  return {
    ...actual,
    getStoredCartItems: () => [{ id: "1", quantity: actual.quantity(1)._unsafeUnwrap() }],
  };
});

beforeEach(() => {
  vi.resetModules();
});

test("shows error message when fetch fails", async () => {
  global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

  const { default: CartRoute } = await import("./page");
  render(<CartRoute />);

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
  });
});
