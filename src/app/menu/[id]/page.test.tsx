import { render, screen } from "@testing-library/react";
import ProductDetailPage from "./page";

test("shows product name as heading", async () => {
  const page = await ProductDetailPage({
    params: { id: "1" },
    getProduct: async () => ({
      id: "1",
      name: "Ramen",
      price: 800,
      description: "Delicious",
    }),
  });
  render(page);
  expect(
    screen.getByRole("heading", { name: "Ramen" })
  ).toBeInTheDocument();
});
