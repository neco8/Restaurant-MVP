import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as lib from "@/lib";
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
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/orders/pi_test_123/complete");
    });
  });

  it("renders Place Order button", () => {
    render(
      <StripePaymentForm
        clientSecret="pi_test_secret_abc"
        paymentIntentId="pi_test_123"
      />
    );
    expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
  });
});

describe("redirect uses server-authoritative paymentIntentId", () => {
  it("redirects using paymentIntentId prop, not result.paymentIntent.id", async () => {
    mockConfirmPayment.mockResolvedValue({
      paymentIntent: { id: "pi_from_stripe_response", status: "succeeded" },
    });

    render(
      <StripePaymentForm
        clientSecret="pi_test_secret"
        paymentIntentId="pi_from_api"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/orders/pi_from_api/complete");
    });
  });
});

describe("when payment succeeds", () => {
  it("clears the cart after successful payment", async () => {
    mockConfirmPayment.mockResolvedValue({
      paymentIntent: { status: "succeeded", id: "pi_test_123" },
    });

    const clearCartSpy = vi.spyOn(lib, "clearCart").mockImplementation(() => {});

    render(
      <StripePaymentForm
        clientSecret="pi_test_secret"
        paymentIntentId="pi_test_123"
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => {
      expect(clearCartSpy).toHaveBeenCalledOnce();
    });

    clearCartSpy.mockRestore();
  });
});

describe("StripePaymentForm props contract", () => {
  it("requires both clientSecret and paymentIntentId props", () => {
    render(<StripePaymentForm clientSecret="pi_test_secret" paymentIntentId="pi_test_123" />);
    expect(screen.getByTestId("stripe-elements")).toBeInTheDocument();
  });
});

describe("when payment status is processing", () => {
  it("clears cart and redirects to order complete when payment is processing", async () => {
    // BUG: For async payment methods (ACH, SEPA, etc.), confirmPayment
    // returns paymentIntent.status === "processing".
    // The current code only handles "succeeded" and "error".
    // Result: loading stays true forever, cart is NOT cleared, no redirect.
    // The customer's payment IS being processed (money debited), but they
    // get no confirmation. They may attempt to pay again → double charge.
    mockConfirmPayment.mockResolvedValue({
      paymentIntent: { id: "pi_processing_123", status: "processing" },
    });

    const clearCartSpy = vi.spyOn(lib, "clearCart").mockImplementation(() => {});

    render(
      <StripePaymentForm
        clientSecret="pi_test_secret"
        paymentIntentId="pi_test_123"
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => {
      expect(clearCartSpy).toHaveBeenCalledOnce();
    });

    expect(mockPush).toHaveBeenCalledWith("/orders/pi_test_123/complete");

    clearCartSpy.mockRestore();
  });
});
