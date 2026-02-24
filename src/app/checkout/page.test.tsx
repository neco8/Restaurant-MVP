import { render, screen } from "@testing-library/react";
import { CheckoutPage } from "./page";

test("shows Checkout heading", () => {
  render(<CheckoutPage />);
  expect(screen.getByRole("heading", { name: "Checkout" })).toBeInTheDocument();
});

test("shows Place Order button", () => {
  render(<CheckoutPage />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
});

test("shows Order Summary heading", () => {
  render(<CheckoutPage />);
  expect(screen.getByRole("heading", { name: "Order Summary" })).toBeInTheDocument();
});

test("shows empty cart message when no items", () => {
  render(<CheckoutPage />);
  expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
});

test("shows item name when cart has one item", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.getByText("Burger")).toBeInTheDocument();
});

test("shows item price when cart has one item", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.getByText("$9.99")).toBeInTheDocument();
});

test("Place Order button is disabled when cart is empty", () => {
  render(<CheckoutPage />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeDisabled();
});

test("Place Order button is enabled when cart has items", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeEnabled();
});

test("shows item quantity when greater than one", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 2 }]} />);
  expect(screen.getByText("×2")).toBeInTheDocument();
});

test("does not show quantity badge when quantity is one", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.queryByText("×1")).not.toBeInTheDocument();
});

test("total reflects quantity", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 2 }]} />);
  expect(screen.getByText("Total: $19.98")).toBeInTheDocument();
});

test("shows line total for item with quantity greater than one", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 2 }]} />);
  expect(screen.getByText("$19.98")).toBeInTheDocument();
});

test("shows order total for multiple items", () => {
  render(
    <CheckoutPage
      cartItems={[
        { id: "1", name: "Burger", price: 9.99, quantity: 1 },
        { id: "2", name: "Fries", price: 3.49, quantity: 1 },
      ]}
    />
  );
  expect(screen.getByText("Total: $13.48")).toBeInTheDocument();
});

test("checkout total section has checkout-total testid", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.getByTestId("checkout-total")).toBeInTheDocument();
});
