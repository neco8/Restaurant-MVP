import { render, screen } from "@testing-library/react";
import MenuPage from "./page";
import { defaultProductRepository, getProducts } from "@/lib";

vi.mock("@/lib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib")>();
  return {
    ...actual,
    getProducts: vi.fn(),
  };
});

test("shows Menu heading", async () => {
  vi.mocked(getProducts).mockResolvedValue(
    await actual().then((m) => m.defaultProductRepository().findAll())
  );
  const page = await MenuPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
});

async function actual() {
  return import("@/lib");
}

test("shows products from default repository when no mock provided", async () => {
  const products = await defaultProductRepository().findAll();
  vi.mocked(getProducts).mockResolvedValue(products);
  const page = await MenuPage();
  render(page);
  expect(screen.getAllByTestId("product-card")).toHaveLength(products.length);
});

test("shows product cards from getProducts", async () => {
  vi.mocked(getProducts).mockResolvedValue([
    { id: "1", name: "Ramen", price: 8.00, description: "Delicious" },
  ]);
  const page = await MenuPage();
  render(page);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});
