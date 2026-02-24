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
