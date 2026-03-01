import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminDashboardPage from "./page";
import { logout } from "@/app/admin/actions";

vi.mock("@/app/admin/actions", () => ({
  logout: vi.fn(),
}));

test("renders dashboard heading and navigation links", () => {
  render(<AdminDashboardPage />);

  expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Orders" })).toBeInTheDocument();
});

test("calls logout action when Log out button is clicked", async () => {
  const user = userEvent.setup();

  render(<AdminDashboardPage />);

  const logoutButton = screen.getByRole("button", { name: "Log out" });
  await user.click(logoutButton);

  expect(logout).toHaveBeenCalled();
});
