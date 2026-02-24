import { render, screen } from "@testing-library/react";
import { CartPage } from "./page";

test("shows Cart heading", () => {
  render(<CartPage />);
  expect(screen.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
});

test("shows product name when cartItems provided", () => {
  render(
    <CartPage
      cartItems={[{ id: "1", name: "Ramen", price: 8.00, quantity: 1 }]}
    />
  );
  expect(screen.getByText("Ramen")).toBeInTheDocument();
});

test("shows Proceed to Checkout link", () => {
  render(<CartPage />);
  expect(
    screen.getByRole("link", { name: "Proceed to Checkout" })
  ).toBeInTheDocument();
});
