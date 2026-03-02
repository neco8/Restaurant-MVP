import { render, screen } from "@testing-library/react";
import ProductDetailPage from "./page";
import { price } from "@/lib/price";

vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: vi.fn().mockReturnValue({
    findAll: async () => [
      { id: "1", name: "Ramen", price: price(8.00), description: "Delicious" },
    ],
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

test("shows product name as heading", async () => {
  const page = await ProductDetailPage({ params: { id: "1" } });
  render(page);
  expect(screen.getByRole("heading", { name: "Ramen" })).toBeInTheDocument();
});

test("should call notFound when product does not exist", async () => {
  const { notFound } = await import("next/navigation");
  await ProductDetailPage({ params: { id: "non-existent-id" } });
  expect(notFound).toHaveBeenCalled();
});
