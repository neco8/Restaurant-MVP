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
