import { render, screen, waitFor } from "@testing-library/react";
import AdminProductsPage from "./page";

beforeEach(() => {
  vi.clearAllMocks();
});

it("renders the Products heading and Add Product link", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve([]),
  });

  render(<AdminProductsPage />);

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
  });

  expect(screen.getByRole("link", { name: "Add Product" })).toBeInTheDocument();
});
