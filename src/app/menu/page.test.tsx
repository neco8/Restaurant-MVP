import { render, screen } from "@testing-library/react";
import MenuPage from "./page";

test("shows メニュー heading", async () => {
  const page = await MenuPage();
  render(page);
  expect(
    screen.getByRole("heading", { name: "メニュー" })
  ).toBeInTheDocument();
});

test("shows product cards from getProducts", async () => {
  const page = await MenuPage({
    getProducts: async () => [
      { id: "1", name: "ラーメン", price: 800, description: "おいしい" },
    ],
  });
  render(page);
  expect(screen.getByTestId("product-name")).toHaveTextContent("ラーメン");
});
