import { render, screen } from "@testing-library/react";
import MenuPage from "./page";
import { defaultProductRepository } from "@/lib";
import { price } from "@/lib/price";

test("shows Menu heading", async () => {
  const page = await MenuPage();
  render(page);
  expect(
    screen.getByRole("heading", { name: "Menu" })
  ).toBeInTheDocument();
});

test("shows products from default repository when no getProducts provided", async () => {
  const page = await MenuPage();
  render(page);
  const products = await defaultProductRepository().findAll();
  expect(screen.getAllByTestId("product-card")).toHaveLength(products.length);
});

test("shows product cards from getProducts", async () => {
  const page = await MenuPage({
    getProducts: async () => [
      { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" },
    ],
  });
  render(page);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});
