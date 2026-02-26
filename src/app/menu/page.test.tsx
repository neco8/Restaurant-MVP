import { render, screen } from "@testing-library/react";
import MenuPage from "./page";
import { getProducts } from "@/lib";
import { price } from "@/lib/price";

vi.mock("@/lib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib")>();
  return {
    ...actual,
    getProducts: vi.fn(),
  };
});

vi.mock("@/lib/defaultProductRepository", () => ({
  defaultProductRepository: vi.fn().mockReturnValue({
    findAll: async () => [],
  }),
}));

const sampleProducts = [
  { id: "1", name: "Ramen", price: price(12.0), description: "Rich tonkotsu broth" },
  { id: "2", name: "Gyoza", price: price(7.5), description: "Pan-fried pork dumplings" },
];

test("shows Menu heading", async () => {
  vi.mocked(getProducts).mockResolvedValue(sampleProducts);
  const page = await MenuPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
});

test("shows products from default repository when no mock provided", async () => {
  vi.mocked(getProducts).mockResolvedValue(sampleProducts);
  const page = await MenuPage();
  render(page);
  expect(screen.getAllByTestId("product-card")).toHaveLength(sampleProducts.length);
});

test("shows product cards from getProducts", async () => {
  vi.mocked(getProducts).mockResolvedValue([
    { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" },
  ]);
  const page = await MenuPage();
  render(page);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});
