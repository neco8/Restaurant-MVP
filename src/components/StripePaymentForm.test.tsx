import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StripePaymentForm } from "./StripePaymentForm";

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stripe-elements">{children}</div>
  ),
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => null,
  useElements: () => null,
}));

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn().mockResolvedValue({}),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("StripePaymentForm", () => {
  it("renders Stripe Elements wrapper", () => {
    render(<StripePaymentForm clientSecret="pi_test_secret" paymentIntentId="pi_test_123" amountInCents={1200} />);
    expect(screen.getByTestId("stripe-elements")).toBeInTheDocument();
  });

  it("renders PaymentElement inside the form", () => {
    render(<StripePaymentForm clientSecret="pi_test_secret" paymentIntentId="pi_test_123" amountInCents={1200} />);
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
  });

  it("renders Place Order button", () => {
    render(<StripePaymentForm clientSecret="pi_test_secret" paymentIntentId="pi_test_123" amountInCents={1200} />);
    expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
  });
});
