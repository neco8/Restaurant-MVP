import { render, screen } from "@testing-library/react";
import AdminDashboardPage from "./page";

test("renders dashboard heading and navigation links", () => {
  render(<AdminDashboardPage />);

  expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Orders" })).toBeInTheDocument();
});
