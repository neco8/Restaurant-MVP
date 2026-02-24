import { render, screen } from "@testing-library/react";
import ProductDetail from "./ProductDetail";

test("shows product name as heading", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 800, description: "Delicious" }}
    />
  );
  expect(
    screen.getByRole("heading", { name: "Ramen" })
  ).toBeInTheDocument();
});

test("shows product price", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 800, description: "Delicious" }}
    />
  );
  expect(screen.getByTestId("product-price")).toHaveTextContent("800");
});

test("shows product description", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 800, description: "Delicious" }}
    />
  );
  expect(screen.getByTestId("product-description")).toHaveTextContent("Delicious");
});

test("shows Add to Cart button", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 800, description: "Delicious" }}
    />
  );
  expect(
    screen.getByRole("button", { name: "Add to Cart" })
  ).toBeInTheDocument();
});
