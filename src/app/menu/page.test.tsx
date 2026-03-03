import { render, screen } from "@testing-library/react";
import MenuPage from "./page";
import { createInMemoryProductRepository } from "@/lib/inMemoryProductRepository";
import { price } from "@/lib/price";
import type { Product } from "@/lib/types";

const DEFAULT_PRODUCTS: Product[] = [
  { id: "1", name: "Ramen", price: price(12.00), description: "Rich tonkotsu broth with chashu pork" },
  { id: "2", name: "Gyoza", price: price(7.50), description: "Pan-fried pork dumplings" },
  { id: "3", name: "Takoyaki", price: price(8.00), description: "Octopus balls with bonito flakes" },
];

vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: vi.fn(() => createInMemoryProductRepository(DEFAULT_PRODUCTS)),
}));

test("shows Menu heading", async () => {
  const page = await MenuPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
});

test("shows products from default repository", async () => {
  const page = await MenuPage();
  render(page);
  expect(screen.getAllByTestId("product-card")).toHaveLength(DEFAULT_PRODUCTS.length);
});

test("shows product cards with correct names", async () => {
  vi.mocked(
    (await import("@/server/productRepository")).defaultProductRepository
  ).mockReturnValue(
    createInMemoryProductRepository([
      { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" },
    ])
  );
  const page = await MenuPage();
  render(page);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});
