import { render, screen } from "@testing-library/react";
import CheckoutPage from "./page";

test("shows Checkout heading", async () => {
  const page = await CheckoutPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Checkout" })).toBeInTheDocument();
});

test("shows Place Order button", async () => {
  const page = await CheckoutPage();
  render(page);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
});

test("shows Order Summary heading", async () => {
  const page = await CheckoutPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Order Summary" })).toBeInTheDocument();
});

test("shows empty cart message when no items", async () => {
  const page = await CheckoutPage();
  render(page);
  expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
});

test("shows item name when cart has one item", async () => {
  const page = await CheckoutPage({ items: [{ name: "Burger", price: 9.99 }] });
  render(page);
  expect(screen.getByText("Burger")).toBeInTheDocument();
});

test("shows item price when cart has one item", async () => {
  const page = await CheckoutPage({ items: [{ name: "Burger", price: 9.99 }] });
  render(page);
  expect(screen.getByText("$9.99")).toBeInTheDocument();
});

test("shows order total for multiple items", async () => {
  const page = await CheckoutPage({
    items: [
      { name: "Burger", price: 9.99 },
      { name: "Fries", price: 3.49 },
    ],
  });
  render(page);
  expect(screen.getByText("Total: $13.48")).toBeInTheDocument();
});
