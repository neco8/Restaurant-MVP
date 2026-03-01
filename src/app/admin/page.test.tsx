import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminDashboardPage from "./page";
import { logout } from "@/app/admin/actions";

vi.mock("@/app/admin/actions", () => ({
  logout: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ orders: [], totalCount: 0 }),
  });
});

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

test("renders recent orders section on dashboard", () => {
  render(<AdminDashboardPage />);

  expect(screen.getByText("最近の注文")).toBeInTheDocument();
});

test("displays empty orders message when no orders exist", () => {
  render(<AdminDashboardPage />);

  expect(screen.getByText("まだ注文はありません")).toBeInTheDocument();
});

test("fetches and displays orders from API", async () => {
  const mockOrders = [
    { id: "ORD-1", status: "pending", total: 1500, createdAt: "2026-03-01T10:00:00Z" },
  ];

  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ orders: mockOrders, totalCount: 1 }),
  });

  render(<AdminDashboardPage />);

  await waitFor(() => {
    expect(screen.getByText("ORD-1")).toBeInTheDocument();
  });

  expect(screen.getByText("$1500.00")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith("/api/admin/orders?limit=5");
});

test("updates order status via API when dropdown changes", async () => {
  const user = userEvent.setup();

  const mockOrders = [
    { id: "ORD-1", status: "pending", total: 1500, createdAt: "2026-03-01T10:00:00Z" },
  ];

  global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
    if (options?.method === "PUT") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve({ orders: mockOrders, totalCount: 1 }),
    });
  });

  render(<AdminDashboardPage />);

  await waitFor(() => {
    expect(screen.getByText("ORD-1")).toBeInTheDocument();
  });

  const statusDropdown = screen.getByDisplayValue("pending");
  await user.selectOptions(statusDropdown, "preparing");

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith("/api/admin/orders/ORD-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "preparing" }),
    });
  });
});
