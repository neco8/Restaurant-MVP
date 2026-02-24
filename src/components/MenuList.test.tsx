import { render, screen } from "@testing-library/react";
import MenuList from "./MenuList";

test("shows メニュー heading", () => {
  render(<MenuList products={[]} />);
  expect(
    screen.getByRole("heading", { name: "メニュー" })
  ).toBeInTheDocument();
});

test("shows one product card when one product given", () => {
  const product = { id: "1", name: "ラーメン", price: 800, description: "おいしい" };
  render(<MenuList products={[product]} />);
  expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  expect(screen.getByTestId("product-name")).toHaveTextContent("ラーメン");
});

test("shows multiple product cards when multiple products given", () => {
  const products = [
    { id: "1", name: "ラーメン", price: 800, description: "おいしい" },
    { id: "2", name: "チャーハン", price: 700, description: "パラパラ" },
  ];
  render(<MenuList products={products} />);
  expect(screen.getAllByTestId("product-card")).toHaveLength(2);
});

test("product card links to /menu/:id", () => {
  const product = { id: "42", name: "ラーメン", price: 800, description: "おいしい" };
  render(<MenuList products={[product]} />);
  const card = screen.getByTestId("product-card");
  expect(card).toHaveAttribute("href", "/menu/42");
});
