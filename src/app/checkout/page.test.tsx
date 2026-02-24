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
