import { render, screen } from "@testing-library/react";
import OrderCompletePage from "./page";

test("shows Thank you for your order heading", async () => {
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByRole("heading", { name: "Thank you for your order" })).toBeInTheDocument();
});

test("shows order-id testid with the payment intent id", async () => {
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByTestId("order-id")).toHaveTextContent("pi_test_123");
});

test("shows payment-status testid with Payment Complete", async () => {
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByTestId("payment-status")).toHaveTextContent("Payment Complete");
});
