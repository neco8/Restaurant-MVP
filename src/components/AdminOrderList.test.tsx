import { render, screen } from "@testing-library/react";
import AdminOrderList from "./AdminOrderList";
import type { AdminOrder } from "./AdminOrderList";

describe("AdminOrderList", () => {
  test("renders empty state when no orders", () => {
    render(<AdminOrderList orders={[]} />);
    expect(screen.getByText("No orders found.")).toBeInTheDocument();
  });

  test("renders order status and total for each order", () => {
    const orders: AdminOrder[] = [
      {
        id: "o1",
        status: "pending",
        total: 27,
        createdAt: "2026-01-15T10:00:00.000Z",
        items: [],
      },
      {
        id: "o2",
        status: "completed",
        total: 12,
        createdAt: "2026-01-16T10:00:00.000Z",
        items: [],
      },
    ];
    render(<AdminOrderList orders={orders} />);

    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("$27.00")).toBeInTheDocument();
    expect(screen.getByText("$12.00")).toBeInTheDocument();
  });
});
