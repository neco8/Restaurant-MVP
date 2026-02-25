import { render, screen } from "@testing-library/react";
import { CartView } from "./CartView";
import { quantity } from "@/lib/quantity";
import { price } from "@/lib/price";

test("shows Cart heading", () => {
  render(<CartView />);
  expect(screen.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
});

test("shows product name when cartItems provided", () => {
  render(
    <CartView
      cartItems={[{ id: "1", name: "Ramen", price: price(8.00), quantity: quantity(1) }]}
    />
  );
  expect(screen.getByText("Ramen")).toBeInTheDocument();
});

test("shows Proceed to Checkout link", () => {
  render(<CartView />);
  expect(
    screen.getByRole("link", { name: "Proceed to Checkout" })
  ).toBeInTheDocument();
});

test("shows item price when cart has one item", () => {
  render(
    <CartView
      cartItems={[{ id: "1", name: "Ramen", price: price(8.00), quantity: quantity(1) }]}
    />
  );
  expect(screen.getByText("$8.00")).toBeInTheDocument();
});

test("shows item quantity", () => {
  render(
    <CartView
      cartItems={[{ id: "1", name: "Ramen", price: price(8.00), quantity: quantity(2) }]}
    />
  );
  expect(screen.getByText("×2")).toBeInTheDocument();
});

test("does not show quantity badge when quantity is one", () => {
  render(
    <CartView
      cartItems={[{ id: "1", name: "Ramen", price: price(8.00), quantity: quantity(1) }]}
    />
  );
  expect(screen.queryByText("×1")).not.toBeInTheDocument();
});

test("shows line total for item with quantity greater than one", () => {
  render(
    <CartView
      cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(2) }]}
    />
  );
  expect(screen.getByText("$19.98")).toBeInTheDocument();
});

test("shows order total for single item", () => {
  render(
    <CartView
      cartItems={[{ id: "1", name: "Ramen", price: price(8.00), quantity: quantity(1) }]}
    />
  );
  expect(screen.getByText("Total: $8.00")).toBeInTheDocument();
});

test("shows order total for multiple items", () => {
  render(
    <CartView
      cartItems={[
        { id: "1", name: "Ramen", price: price(8.00), quantity: quantity(1) },
        { id: "2", name: "Gyoza", price: price(5.50), quantity: quantity(2) },
      ]}
    />
  );
  expect(screen.getByText("Total: $19.00")).toBeInTheDocument();
});

test("shows empty cart message when no items", () => {
  render(<CartView />);
  expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
});
