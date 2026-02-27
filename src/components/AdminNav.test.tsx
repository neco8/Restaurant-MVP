import { render, screen } from "@testing-library/react";
import AdminNav from "./AdminNav";

describe("AdminNav", () => {
  test("renders navigation links for Products and Orders", () => {
    render(<AdminNav />);

    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/admin/products");
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("href", "/admin/orders");
  });
});
