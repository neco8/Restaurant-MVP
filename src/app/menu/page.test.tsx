import { render, screen } from "@testing-library/react";
import MenuPage from "./page";

test("shows Menu heading", async () => {
  const page = await MenuPage();
  render(page);
  expect(
    screen.getByRole("heading", { name: "Menu" })
  ).toBeInTheDocument();
});

test("shows product cards from getProducts", async () => {
  const page = await MenuPage({
    getProducts: async () => [
      { id: "1", name: "Ramen", price: 8.00, description: "Delicious" },
    ],
  });
  render(page);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});
