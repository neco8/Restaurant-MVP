import { render, screen } from "@testing-library/react";
import CartPage from "./page";

test("shows Cart heading", async () => {
  const page = await CartPage();
  render(page);
  expect(screen.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
});
