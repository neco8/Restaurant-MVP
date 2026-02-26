import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminProductList from "./AdminProductList";
import { price } from "@/lib/price";
import { ROUTES } from "@/lib";

test("shows heading when no products", () => {
  render(<AdminProductList products={[]} />);
  expect(
    screen.getByRole("heading", { name: "Products" })
  ).toBeInTheDocument();
});

test("shows empty message when no products", () => {
  render(<AdminProductList products={[]} />);
  expect(screen.getByText("No products yet.")).toBeInTheDocument();
});

test("shows product name and price", () => {
  const products = [
    { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
  ];
  render(<AdminProductList products={products} />);
  expect(screen.getByText("Ramen")).toBeInTheDocument();
  expect(screen.getByText("$12.00")).toBeInTheDocument();
});

test("shows multiple products", () => {
  const products = [
    { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
    { id: "2", name: "Gyoza", price: price(7.5), description: "Dumplings" },
  ];
  render(<AdminProductList products={products} />);
  expect(screen.getAllByTestId("admin-product-row")).toHaveLength(2);
});

test("shows Add Product link", () => {
  render(<AdminProductList products={[]} />);
  const link = screen.getByRole("link", { name: "Add Product" });
  expect(link).toHaveAttribute("href", ROUTES.ADMIN_PRODUCTS_NEW);
});

test("shows Edit link for each product", () => {
  const products = [
    { id: "42", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
  ];
  render(<AdminProductList products={products} />);
  const link = screen.getByRole("link", { name: "Edit Ramen" });
  expect(link).toHaveAttribute("href", ROUTES.ADMIN_PRODUCTS_EDIT("42"));
});

test("shows Delete button when onDelete is provided", () => {
  const products = [
    { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
  ];
  render(<AdminProductList products={products} onDelete={vi.fn()} />);
  expect(screen.getByRole("button", { name: "Delete Ramen" })).toBeInTheDocument();
});

test("calls onDelete with product id when delete button clicked", async () => {
  const user = userEvent.setup();
  const onDelete = vi.fn();
  const products = [
    { id: "42", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
  ];
  render(<AdminProductList products={products} onDelete={onDelete} />);
  await user.click(screen.getByRole("button", { name: "Delete Ramen" }));
  expect(onDelete).toHaveBeenCalledWith("42");
});
