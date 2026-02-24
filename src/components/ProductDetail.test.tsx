import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductDetail from "./ProductDetail";

test("shows product name as heading", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 8.00, description: "Delicious" }}
    />
  );
  expect(
    screen.getByRole("heading", { name: "Ramen" })
  ).toBeInTheDocument();
});

test("shows product price formatted with dollar sign and two decimal places", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 9.90, description: "Delicious" }}
    />
  );
  expect(screen.getByTestId("product-price")).toHaveTextContent("$9.90");
});

test("shows product description", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 8.00, description: "Delicious" }}
    />
  );
  expect(screen.getByTestId("product-description")).toHaveTextContent("Delicious");
});

test("shows Add to Cart button", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 8.00, description: "Delicious" }}
    />
  );
  expect(
    screen.getByRole("button", { name: "Add to Cart" })
  ).toBeInTheDocument();
});

test("calls onAddToCart when Add to Cart is clicked", async () => {
  const onAddToCart = vi.fn();
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 8.00, description: "Delicious" }}
      onAddToCart={onAddToCart}
    />
  );
  await userEvent.click(screen.getByRole("button", { name: "Add to Cart" }));
  expect(onAddToCart).toHaveBeenCalledOnce();
});

test("shows cart count of 0 initially", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 8.00, description: "Delicious" }}
    />
  );
  expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
});

test("increments cart count when Add to Cart is clicked", async () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 8.00, description: "Delicious" }}
    />
  );
  await userEvent.click(screen.getByRole("button", { name: "Add to Cart" }));
  expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
});

test("shows View Cart link", () => {
  render(
    <ProductDetail
      product={{ id: "1", name: "Ramen", price: 8.00, description: "Delicious" }}
    />
  );
  expect(screen.getByRole("link", { name: "View Cart" })).toBeInTheDocument();
});
