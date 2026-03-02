import { render, screen } from "@testing-library/react";
import MenuPage from "./page";
import { stubProductRepository as inMemoryRepo } from "@/lib/stubProductRepository";
import { price } from "@/lib/price";
import type { Product } from "@/lib/types";

let mockProducts: Product[] | null = null;

vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: () => ({
    findAll: async () => mockProducts ?? (await inMemoryRepo().findAll()),
  }),
}));

beforeEach(() => {
  mockProducts = null;
});

test("shows Menu heading", async () => {
  const page = await MenuPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
});

test("shows products from default repository when no mock provided", async () => {
  const products = await inMemoryRepo().findAll();
  mockProducts = products;
  const page = await MenuPage();
  render(page);
  expect(screen.getAllByTestId("product-card")).toHaveLength(products.length);
});

test("shows product cards from repository", async () => {
  mockProducts = [
    { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" },
  ];
  const page = await MenuPage();
  render(page);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});
