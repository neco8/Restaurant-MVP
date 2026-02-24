import { render, screen } from "@testing-library/react";
import ProductDetailPage from "./page";
import { price } from "@/lib/price";

test("shows product name as heading", async () => {
  const page = await ProductDetailPage({
    params: { id: "1" },
    getProduct: async () => ({
      id: "1",
      name: "Ramen",
      price: price(8.00),
      description: "Delicious",
    }),
  });
  render(page);
  expect(
    screen.getByRole("heading", { name: "Ramen" })
  ).toBeInTheDocument();
});
