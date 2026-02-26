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

it("shows Payment Processing when Stripe payment status is processing", async () => {
  mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "processing" });
  const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
  render(page);
  expect(screen.getByTestId("payment-status")).toHaveTextContent("Payment Processing");
});

it("shows Payment Failed when payment intent does not exist in Stripe", async () => {
  mockRetrieve.mockRejectedValue(new Error("No such payment_intent: 'invalid_id'"));
  const page = await OrderCompletePage({ params: { id: "invalid_id" } });
  render(page);
  expect(screen.getByTestId("payment-status")).toHaveTextContent("Payment Failed");
});

describe("status explanation messages", () => {
  it("shows explanation when payment is processing", async () => {
    mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "processing" });
    const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
    render(page);
    expect(screen.getByTestId("payment-explanation")).toHaveTextContent(
      "Your payment is being processed. You will receive confirmation shortly."
    );
  });

  it("shows retry guidance when payment method was rejected", async () => {
    mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "requires_payment_method" });
    const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
    render(page);
    expect(screen.getByTestId("payment-explanation")).toHaveTextContent(
      "Your payment method was not accepted. Please return to checkout and try again."
    );
  });

  it("shows canceled message when payment is canceled", async () => {
    mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "canceled" });
    const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
    render(page);
    expect(screen.getByTestId("payment-explanation")).toHaveTextContent(
      "This payment was canceled."
    );
  });

  it("shows contact-support message when Stripe retrieval fails", async () => {
    mockRetrieve.mockRejectedValue(new Error("No such payment_intent"));
    const page = await OrderCompletePage({ params: { id: "invalid_id" } });
    render(page);
    expect(screen.getByTestId("payment-explanation")).toHaveTextContent(
      "We could not retrieve your payment status. Please contact support if you were charged."
    );
  });

  it("does not show explanation when payment succeeded", async () => {
    mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
    const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
    render(page);
    expect(screen.queryByTestId("payment-explanation")).not.toBeInTheDocument();
  });
});

describe("OrderCompletePage structure", () => {
  it("renders exactly one heading", async () => {
    mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
    const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
    render(page);
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("heading is h1", async () => {
    mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
    const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
    render(page);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders order-id element", async () => {
    mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
    const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
    render(page);
    expect(screen.getByTestId("order-id")).toBeInTheDocument();
  });

  it("renders payment-status element", async () => {
    mockRetrieve.mockResolvedValue({ id: "pi_test_123", status: "succeeded" });
    const page = await OrderCompletePage({ params: { id: "pi_test_123" } });
    render(page);
    expect(screen.getByTestId("payment-status")).toBeInTheDocument();
  });
});
