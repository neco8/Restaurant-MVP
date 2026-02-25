import { render, screen } from "@testing-library/react";
import MenuList from "./MenuList";
import { ROUTES } from "@/lib";
import { price } from "@/lib/price";

test("shows Menu heading", () => {
  render(<MenuList products={[]} />);
  expect(
    screen.getByRole("heading", { name: "Menu" })
  ).toBeInTheDocument();
});

test("shows one product card when one product given", () => {
  const product = { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" };
  render(<MenuList products={[product]} />);
  expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  expect(screen.getByTestId("product-name")).toHaveTextContent("Ramen");
});

test("shows multiple product cards when multiple products given", () => {
  const products = [
    { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" },
    { id: "2", name: "Fried Rice", price: price(7.00), description: "Fluffy and savory" },
  ];
  render(<MenuList products={products} />);
  expect(screen.getAllByTestId("product-card")).toHaveLength(2);
});

test("product card links to /menu/:id", () => {
  const product = { id: "42", name: "Ramen", price: price(8.00), description: "Delicious" };
  render(<MenuList products={[product]} />);
  const card = screen.getByTestId("product-card");
  expect(card).toHaveAttribute("href", ROUTES.MENU_ITEM("42"));
});

test("shows product price on card", () => {
  const product = { id: "1", name: "Ramen", price: price(9.90), description: "Delicious" };
  render(<MenuList products={[product]} />);
  expect(screen.getByTestId("product-price")).toHaveTextContent("$9.90");
});

describe("MenuList structure", () => {
  const products = [
    { id: "1", name: "Ramen", price: price(8.0), description: "Delicious" },
    { id: "2", name: "Gyoza", price: price(5.5), description: "Crispy" },
  ];

  test("renders h1 heading", () => {
    render(<MenuList products={products} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  test("renders one link per product", () => {
    render(<MenuList products={products} />);
    expect(screen.getAllByRole("link")).toHaveLength(products.length);
  });

  test("each product card has product-name element", () => {
    render(<MenuList products={products} />);
    expect(screen.getAllByTestId("product-name")).toHaveLength(products.length);
  });

  test("each product card has product-price element", () => {
    render(<MenuList products={products} />);
    expect(screen.getAllByTestId("product-price")).toHaveLength(products.length);
  });
});
