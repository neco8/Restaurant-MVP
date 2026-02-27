import { render, screen } from "@testing-library/react";
import AdminOrderList from "./AdminOrderList";

describe("AdminOrderList", () => {
  test("renders empty state when no orders", () => {
    render(<AdminOrderList orders={[]} />);
    expect(screen.getByText("No orders found.")).toBeInTheDocument();
  });
});
