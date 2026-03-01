import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import RecentOrders from "./RecentOrders";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

type Order = { id: string; status: string; total: number; createdAt: string };

test("displays empty state message when orders array is empty", () => {
  render(<RecentOrders orders={[]} />);
  expect(screen.getByText("まだ注文はありません")).toBeInTheDocument();
});

test("displays table with order information when orders exist", () => {
  const testOrder: Order = {
    id: "ORDER-001",
    status: "done",
    total: 2500,
    createdAt: "2026-03-01T10:30:00Z",
  };

  render(<RecentOrders orders={[testOrder]} />);

  expect(screen.getByText("ORDER-001")).toBeInTheDocument();
  expect(screen.getByText("$2500.00")).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toHaveValue("done");
});

test("displays formatted date in order row", () => {
  const testOrder: Order = {
    id: "ORDER-001",
    status: "done",
    total: 2500,
    createdAt: "2026-03-01T10:30:00Z",
  };

  render(<RecentOrders orders={[testOrder]} />);

  expect(screen.getByText(/2026/)).toBeInTheDocument();
});

test("order row contains link to admin order detail page", () => {
  const testOrder: Order = {
    id: "ORDER-001",
    status: "done",
    total: 2500,
    createdAt: "2026-03-01T10:30:00Z",
  };

  render(<RecentOrders orders={[testOrder]} />);

  const link = screen.getByRole("link", { name: /ORDER-001/ });
  expect(link).toHaveAttribute("href", "/admin/orders/ORDER-001");
});

test("status in order row is rendered as a dropdown combobox", () => {
  const testOrder: Order = {
    id: "ORDER-001",
    status: "pending",
    total: 2500,
    createdAt: "2026-03-01T10:30:00Z",
  };

  render(<RecentOrders orders={[testOrder]} />);

  const combobox = screen.getByRole("combobox");
  expect(combobox).toHaveValue("pending");

  const options = within(combobox).getAllByRole("option");
  expect(options).toHaveLength(3);
});

test("calls onStatusUpdate callback when status dropdown changes", async () => {
  const mockOnStatusUpdate = vi.fn();
  const testOrder: Order = {
    id: "ORDER-001",
    status: "pending",
    total: 2500,
    createdAt: "2026-03-01T10:30:00Z",
  };

  render(<RecentOrders orders={[testOrder]} onStatusUpdate={mockOnStatusUpdate} />);

  const combobox = screen.getByRole("combobox");
  const user = userEvent.setup();
  await user.selectOptions(combobox, "preparing");

  expect(mockOnStatusUpdate).toHaveBeenCalledWith("ORDER-001", "preparing");
});

test("does not show view all link when totalCount is 5 or less", () => {
  const testOrders: Order[] = [
    {
      id: "ORDER-001",
      status: "done",
      total: 2500,
      createdAt: "2026-03-01T10:30:00Z",
    },
    {
      id: "ORDER-002",
      status: "preparing",
      total: 3500,
      createdAt: "2026-03-01T10:15:00Z",
    },
  ];

  render(<RecentOrders orders={testOrders} totalCount={2} />);

  const viewAllLink = screen.queryByRole("link", { name: "すべての注文を見る" });
  expect(viewAllLink).not.toBeInTheDocument();
});

test("shows view all link to /admin/orders when totalCount exceeds 5", () => {
  const testOrders: Order[] = [
    {
      id: "ORDER-001",
      status: "done",
      total: 2500,
      createdAt: "2026-03-01T10:30:00Z",
    },
    {
      id: "ORDER-002",
      status: "preparing",
      total: 3500,
      createdAt: "2026-03-01T10:15:00Z",
    },
  ];

  render(<RecentOrders orders={testOrders} totalCount={7} />);

  const viewAllLink = screen.getByRole("link", { name: "すべての注文を見る" });
  expect(viewAllLink).toBeInTheDocument();
  expect(viewAllLink).toHaveAttribute("href", "/admin/orders");
});
