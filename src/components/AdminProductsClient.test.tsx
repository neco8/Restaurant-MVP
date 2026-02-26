import { render, screen } from "@testing-library/react";
import AdminProductsClient from "./AdminProductsClient";
import { price } from "@/lib/price";
import type { Product } from "@/lib";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = vi.fn();
});

test("updates displayed products when initialProducts prop changes", () => {
  const oldProducts: Product[] = [
    { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
  ];
  const { rerender } = render(
    <AdminProductsClient initialProducts={oldProducts} />
  );
  expect(screen.getByText("Ramen")).toBeInTheDocument();

  const newProducts: Product[] = [
    { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
    { id: "2", name: "New Test Udon", price: price(10.0), description: "Thick wheat noodles" },
  ];
  rerender(<AdminProductsClient initialProducts={newProducts} />);

  expect(screen.getByText("New Test Udon")).toBeInTheDocument();
});
