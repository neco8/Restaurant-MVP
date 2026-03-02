import { render, screen } from "@testing-library/react";
import MenuPage from "./page";
import { getProducts } from "@/lib";
import { stubProductRepository as inMemoryRepo } from "@/lib/stubProductRepository";
import { price } from "@/lib/price";

vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: () => inMemoryRepo(),
}));

vi.mock("@/lib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib")>();
  return {
    ...actual,
    getProducts: vi.fn(),
  };
});

test("shows Menu heading", async () => {
  vi.mocked(getProducts).mockResolvedValue(
    await inMemoryRepo().findAll()
  );
  const page = await MenuPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
});

test("shows products from default repository when no mock provided", async () => {
  const products = await inMemoryRepo().findAll();
  vi.mocked(getProducts).mockResolvedValue(products);
  const page = await MenuPage();
  render(page);
  expect(screen.getAllByTestId("product-card")).toHaveLength(products.length);
});

test("shows product cards from getProducts", async () => {
  vi.mocked(getProducts).mockResolvedValue([
    { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" },
  ]);
  const page = await MenuPage();
  render(page);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});
