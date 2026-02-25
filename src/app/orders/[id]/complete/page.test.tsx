import { vi, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockRetrieve = vi.fn();

vi.mock("stripe", () => {
  function MockStripe() {
    return { paymentIntents: { retrieve: mockRetrieve } };
  }
  return { default: MockStripe };
});

import OrderCompletePage from "./page";

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_fake";
  mockRetrieve.mockReset();
});

it("shows Thank you for your order heading", async () => {
  mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByRole("heading", { name: "Thank you for your order" })).toBeInTheDocument();
});

it("shows order-id testid with the payment intent id", async () => {
  mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByTestId("order-id")).toHaveTextContent("pi_test_123");
});

it("verifies payment intent status via Stripe API", async () => {
  mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
  await OrderCompletePage({ params: { id: "pi_test_123" } });
  expect(mockRetrieve).toHaveBeenCalledWith("pi_test_123");
});

it("shows Payment Complete when Stripe payment status is succeeded", async () => {
  mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByTestId("payment-status")).toHaveTextContent("Payment Complete");
});

it("shows Payment Failed when Stripe payment status is requires_payment_method", async () => {
  mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "requires_payment_method" });
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByTestId("payment-status")).toHaveTextContent("Payment Failed");
});

it("shows Payment Failed when Stripe payment status is canceled", async () => {
  mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "canceled" });
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByTestId("payment-status")).toHaveTextContent("Payment Failed");
});

it("shows Payment Failed when payment intent does not exist in Stripe", async () => {
  mockRetrieve.mockRejectedValue(new Error("No such payment_intent: 'invalid_id'"));
  const page = await OrderCompletePage({ params: { id: "invalid_id" } });
  render(page);
  expect(screen.getByTestId("payment-status")).toHaveTextContent("Payment Failed");
});
