import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  test("renders item details for each order", () => {
    const orders: AdminOrder[] = [
      {
        id: "o1",
        status: "pending",
        total: 27,
        createdAt: "2026-01-15T10:00:00.000Z",
        items: [
          { id: "i1", productName: "Ramen", quantity: 1, price: 12 },
          { id: "i2", productName: "Gyoza", quantity: 2, price: 7.5 },
        ],
      },
    ];
    render(<AdminOrderList orders={orders} />);

    expect(screen.getByText("Ramen")).toBeInTheDocument();
    expect(screen.getByText("Gyoza")).toBeInTheDocument();
  });

  test("renders mark as completed button for pending orders", () => {
    const orders: AdminOrder[] = [
      {
        id: "o1",
        status: "pending",
        total: 12,
        createdAt: "2026-01-15T10:00:00.000Z",
        items: [{ id: "i1", productName: "Ramen", quantity: 1, price: 12 }],
      },
      {
        id: "o2",
        status: "completed",
        total: 12,
        createdAt: "2026-01-16T10:00:00.000Z",
        items: [{ id: "i2", productName: "Gyoza", quantity: 1, price: 12 }],
      },
    ];
    const onStatusUpdate = vi.fn();
    render(<AdminOrderList orders={orders} onStatusUpdate={onStatusUpdate} />);

    const buttons = screen.getAllByRole("button", { name: "Mark as done" });
    expect(buttons).toHaveLength(1);
  });

  test("calls onStatusUpdate with order id and new status when button clicked", async () => {
    const user = userEvent.setup();
    const orders: AdminOrder[] = [
      {
        id: "o1",
        status: "pending",
        total: 12,
        createdAt: "2026-01-15T10:00:00.000Z",
        items: [{ id: "i1", productName: "Ramen", quantity: 1, price: 12 }],
      },
    ];
    const onStatusUpdate = vi.fn();
    render(<AdminOrderList orders={orders} onStatusUpdate={onStatusUpdate} />);

    await user.click(screen.getByRole("button", { name: "Mark as done" }));

    expect(onStatusUpdate).toHaveBeenCalledWith("o1", "done");
  });

  test("calls onStatusUpdate with done status when mark as completed button is clicked", async () => {
    const user = userEvent.setup();
    const orders: AdminOrder[] = [
      {
        id: "o1",
        status: "pending",
        total: 12,
        createdAt: "2026-01-15T10:00:00.000Z",
        items: [{ id: "i1", productName: "Ramen", quantity: 1, price: 12 }],
      },
    ];
    const onStatusUpdate = vi.fn();
    render(<AdminOrderList orders={orders} onStatusUpdate={onStatusUpdate} />);

    await user.click(screen.getByRole("button", { name: "Mark as done" }));

    expect(onStatusUpdate).toHaveBeenCalledWith("o1", "done");
  });
});
