import { render, screen } from "@testing-library/react";
import ProductDetailPage from "./page";

vi.mock("@/lib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib")>();
  return {
    ...actual,
    defaultProductRepository: vi.fn().mockReturnValue({
      findAll: async () => [
        { id: "1", name: "Ramen", price: 8.0, description: "Delicious" },
      ],
    }),
  };
});

test("shows product name as heading", async () => {
  const page = await ProductDetailPage({ params: { id: "1" } });
  render(page);
  expect(screen.getByRole("heading", { name: "Ramen" })).toBeInTheDocument();
});

test("shows product name from default repository when no getProduct provided", async () => {
  const page = await ProductDetailPage({ params: { id: "1" } });
  render(page);
  expect(
    screen.getByRole("heading", { name: "Ramen" })
  ).toBeInTheDocument();
});
