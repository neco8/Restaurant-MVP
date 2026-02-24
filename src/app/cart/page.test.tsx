import { render, screen } from "@testing-library/react";
import CartPage from "./page";

test("shows Cart heading", async () => {
  const page = await CartPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
});

test("shows product name from getCartItems", async () => {
  const page = await CartPage({
    getCartItems: async () => [
      { id: "1", name: "Ramen", price: 800, description: "Delicious" },
    ],
  });
  render(page);
  expect(screen.getByText("Ramen")).toBeInTheDocument();
});
