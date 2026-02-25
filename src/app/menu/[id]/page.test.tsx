import { render, screen } from "@testing-library/react";
import ProductDetailPage from "./page";
import { price } from "@/lib/price";

vi.mock("@/lib/server/defaultProductRepository", () => ({
  defaultProductRepository: vi.fn().mockReturnValue({
    findAll: async () => [
      { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" },
    ],
  }),
}));

test("shows product name as heading", async () => {
  const page = await ProductDetailPage({ params: { id: "1" } });
  render(page);
  expect(screen.getByRole("heading", { name: "Ramen" })).toBeInTheDocument();
});
