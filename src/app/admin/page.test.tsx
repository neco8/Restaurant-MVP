import { render, screen } from "@testing-library/react";
import AdminDashboardPage from "./page";

test("renders dashboard heading and navigation links", () => {
  render(<AdminDashboardPage />);

  expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Orders" })).toBeInTheDocument();
});

test("renders recent orders section on dashboard", () => {
  render(<AdminDashboardPage />);

  expect(screen.getByText("最近の注文")).toBeInTheDocument();
});
