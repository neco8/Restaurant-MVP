import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AdminProductsPage from "./page";

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve([]),
  });
});

test("shows error message when fetching products fails", async () => {
  global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

  render(<AdminProductsPage />);

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
  });
});
