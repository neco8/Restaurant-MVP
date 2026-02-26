import { render, screen } from "@testing-library/react";
import AdminProductsPage from "./page";
import { getProducts } from "@/lib";
import { price } from "@/lib/price";

vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: () => ({ findAll: vi.fn() }),
}));

vi.mock("@/lib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib")>();
  return {
    ...actual,
    getProducts: vi.fn(),
  };
});

test("shows Products heading", async () => {
  vi.mocked(getProducts).mockResolvedValue([]);
  const page = await AdminProductsPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
});

test("shows products from getProducts", async () => {
  vi.mocked(getProducts).mockResolvedValue([
    { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
  ]);
  const page = await AdminProductsPage();
  render(page);
  expect(screen.getByText("Ramen")).toBeInTheDocument();
});
