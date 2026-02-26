import { render, screen } from "@testing-library/react";
import AdminProductList from "./AdminProductList";
import type { Product } from "@/lib";
import { price } from "@/lib";

describe("AdminProductList", () => {
  test("renders empty state when no products", () => {
    render(<AdminProductList products={[]} onDelete={vi.fn()} />);
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  test("renders product names in table cells", () => {
    const products: Product[] = [
      { id: "1", name: "Ramen", price: price(12), description: "Tasty" },
      { id: "2", name: "Gyoza", price: price(7.5), description: "Crispy" },
    ];
    render(<AdminProductList products={products} onDelete={vi.fn()} />);

    expect(screen.getByRole("cell", { name: "Ramen" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Gyoza" })).toBeInTheDocument();
  });

  test("renders product prices formatted", () => {
    const products: Product[] = [
      { id: "1", name: "Ramen", price: price(12), description: "Tasty" },
    ];
    render(<AdminProductList products={products} onDelete={vi.fn()} />);

    expect(screen.getByRole("cell", { name: "$12.00" })).toBeInTheDocument();
  });

  test("renders edit links for each product", () => {
    const products: Product[] = [
      { id: "1", name: "Ramen", price: price(12), description: "Tasty" },
    ];
    render(<AdminProductList products={products} onDelete={vi.fn()} />);

    expect(
      screen.getByRole("link", { name: "Edit Ramen" })
    ).toBeInTheDocument();
  });

  test("renders delete buttons for each product", () => {
    const products: Product[] = [
      { id: "1", name: "Ramen", price: price(12), description: "Tasty" },
    ];
    render(<AdminProductList products={products} onDelete={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Delete Ramen" })
    ).toBeInTheDocument();
  });

  test("calls onDelete with product id when delete button clicked", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const onDelete = vi.fn();
    const products: Product[] = [
      { id: "1", name: "Ramen", price: price(12), description: "Tasty" },
    ];
    render(<AdminProductList products={products} onDelete={onDelete} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Delete Ramen" })
    );

    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
