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

it("displays product names fetched from the API", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve([{ id: "1", name: "Test Burger", price: 12.00 }]),
  });

  render(<AdminProductsPage />);

  await waitFor(() => {
    expect(screen.getByText("Test Burger")).toBeInTheDocument();
  });
});
