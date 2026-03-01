import { render, screen, within } from "@testing-library/react";
import RecentOrders from "./RecentOrders";

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
  expect(screen.getByText("¥2,500")).toBeInTheDocument();
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
