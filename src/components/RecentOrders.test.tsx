import { render, screen } from "@testing-library/react";
import RecentOrders from "./RecentOrders";

test("displays empty state message when orders array is empty", () => {
  render(<RecentOrders orders={[]} />);
  expect(screen.getByText("まだ注文はありません")).toBeInTheDocument();
});
