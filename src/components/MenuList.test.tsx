import { render, screen } from "@testing-library/react";
import MenuList from "./MenuList";
import { ROUTES } from "@/lib";

test("shows Menu heading", () => {
  render(<MenuList products={[]} />);
  expect(
    screen.getByRole("heading", { name: "Menu" })
  ).toBeInTheDocument();
});

test("shows one product card when one product given", () => {
  const product = { id: "1", name: "Ramen", price: 800, description: "Delicious" };
  render(<MenuList products={[product]} />);
  expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});

test("shows multiple product cards when multiple products given", () => {
  const products = [
    { id: "1", name: "Ramen", price: 800, description: "Delicious" },
    { id: "2", name: "Fried Rice", price: 700, description: "Fluffy and savory" },
  ];
  render(<MenuList products={products} />);
  expect(screen.getAllByTestId("product-card")).toHaveLength(2);
});

test("product card links to /menu/:id", () => {
  const product = { id: "42", name: "Ramen", price: 800, description: "Delicious" };
  render(<MenuList products={[product]} />);
  const card = screen.getByTestId("product-card");
  expect(card).toHaveAttribute("href", ROUTES.MENU_ITEM("42"));
});

test("shows product price on card", () => {
  const product = { id: "1", name: "Ramen", price: 9.90, description: "Delicious" };
  render(<MenuList products={[product]} />);
  expect(screen.getByTestId("product-price")).toHaveTextContent("$9.90");
});
