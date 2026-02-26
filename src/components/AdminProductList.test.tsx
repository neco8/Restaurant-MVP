import { render, screen } from "@testing-library/react";
import AdminProductList from "./AdminProductList";
import { price } from "@/lib/price";

test("shows heading when no products", () => {
  render(<AdminProductList products={[]} />);
  expect(
    screen.getByRole("heading", { name: "Products" })
  ).toBeInTheDocument();
});

test("shows empty message when no products", () => {
  render(<AdminProductList products={[]} />);
  expect(screen.getByText("No products yet.")).toBeInTheDocument();
});

test("shows product name and price", () => {
  const products = [
    { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
  ];
  render(<AdminProductList products={products} />);
  expect(screen.getByText("Ramen")).toBeInTheDocument();
  expect(screen.getByText("$12.00")).toBeInTheDocument();
});

test("shows multiple products", () => {
  const products = [
    { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
    { id: "2", name: "Gyoza", price: price(7.5), description: "Dumplings" },
  ];
  render(<AdminProductList products={products} />);
  expect(screen.getAllByTestId("admin-product-row")).toHaveLength(2);
});
