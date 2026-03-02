import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminOrdersPage from "./page";

beforeEach(() => {
  vi.clearAllMocks();
});

test("shows error message when fetching orders fails", async () => {
  global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

  render(<AdminOrdersPage />);

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
  });
});

test("fetches orders and renders AdminOrderList", async () => {
  const mockOrders = [
    {
      id: "o1",
      status: "pending",
      total: 27,
      createdAt: "2026-01-15T10:00:00.000Z",
      items: [
        { id: "i1", productName: "Ramen", quantity: 1, price: 12 },
      ],
    },
  ];

  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ orders: mockOrders, totalCount: mockOrders.length }),
  });

  render(<AdminOrdersPage />);

  await waitFor(() => {
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  expect(screen.getByText("$27.00")).toBeInTheDocument();
  expect(screen.getByText("Ramen")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Orders" })).toBeInTheDocument();
});

test("updates order status when mark as done is clicked", async () => {
  const user = userEvent.setup();
  const mockOrders = [
    {
      id: "o1",
      status: "pending",
      total: 27,
      createdAt: "2026-01-15T10:00:00.000Z",
      items: [
        { id: "i1", productName: "Ramen", quantity: 1, price: 12 },
      ],
    },
  ];

  global.fetch = vi.fn()
    .mockResolvedValueOnce({ json: () => Promise.resolve({ orders: mockOrders, totalCount: mockOrders.length }) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: "o1", status: "done" }) });

  render(<AdminOrdersPage />);

  await waitFor(() => {
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  await user.click(screen.getByRole("button", { name: "Mark as done" }));

  await waitFor(() => {
    expect(screen.getByText("done")).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledWith(
    "/api/admin/orders/o1",
    expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ status: "done" }),
    }),
  );
});
