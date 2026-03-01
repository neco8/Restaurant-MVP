import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboardPage from "./page";

beforeEach(() => {
  vi.clearAllMocks();
});

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

  expect(screen.getByText("¥1,500")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith("/api/admin/orders?limit=5");
});
