import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StripePaymentForm } from "./StripePaymentForm";

const mockConfirmPayment = vi.fn();
const mockStripe = { confirmPayment: mockConfirmPayment };

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => mockStripe,
  useElements: () => ({}),
}));

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn().mockResolvedValue({}),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => {
  mockConfirmPayment.mockReset();
  mockPush.mockReset();
});

describe("StripePaymentForm", () => {
  it("calls stripe.confirmPayment with correct parameters when Place Order is clicked", async () => {
    mockConfirmPayment.mockResolvedValue({ paymentIntent: { id: "pi_123", status: "succeeded" } });

    render(
      <StripePaymentForm
        clientSecret="pi_test_secret_abc"
        paymentIntentId="pi_test_123"
        amountInCents={1200}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => {
      expect(mockConfirmPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.anything(),
          redirect: "if_required",
        })
      );
    });
  });

  it("shows Processing... and disables button while payment is in progress", async () => {
    let resolvePayment!: (value: unknown) => void;
    mockConfirmPayment.mockReturnValue(
      new Promise((resolve) => {
        resolvePayment = resolve;
      })
    );

    render(
      <StripePaymentForm
        clientSecret="pi_test_secret_abc"
        paymentIntentId="pi_test_123"
        amountInCents={1200}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Processing..." })).toBeDisabled();
    });

    resolvePayment({ paymentIntent: { id: "pi_123", status: "succeeded" } });
  });

  it("displays error message when stripe.confirmPayment returns an error", async () => {
    mockConfirmPayment.mockResolvedValue({
      error: { message: "Your card was declined." },
    });

    render(
      <StripePaymentForm
        clientSecret="pi_test_secret_abc"
        paymentIntentId="pi_test_123"
        amountInCents={1200}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Your card was declined.");
    });
  });

  it("redirects to order confirmation URL when payment succeeds", async () => {
    mockConfirmPayment.mockResolvedValue({
      paymentIntent: { id: "pi_abc123", status: "succeeded" },
    });

    render(
      <StripePaymentForm
        clientSecret="pi_test_secret_abc"
        paymentIntentId="pi_test_123"
        amountInCents={1200}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/orders/pi_abc123/complete");
    });
  });

  it("renders Place Order button", () => {
    render(
      <StripePaymentForm
        clientSecret="pi_test_secret_abc"
        paymentIntentId="pi_test_123"
        amountInCents={1200}
      />
    );
    expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
  });
});
