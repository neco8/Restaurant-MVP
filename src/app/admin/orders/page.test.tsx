import { render, screen, waitFor } from "@testing-library/react";
import AdminOrdersPage from "./page";

beforeEach(() => {
  vi.clearAllMocks();
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
    json: () => Promise.resolve(mockOrders),
  });

  render(<AdminOrdersPage />);

  await waitFor(() => {
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  expect(screen.getByText("$27.00")).toBeInTheDocument();
  expect(screen.getByText("Ramen")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Orders" })).toBeInTheDocument();
});
