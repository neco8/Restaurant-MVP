import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("@/components/StripePaymentForm", () => ({
  StripePaymentForm: ({
    clientSecret,
    paymentIntentId,
  }: {
    clientSecret: string;
    paymentIntentId: string;
    amountInCents: number;
  }) => (
    <div
      data-testid="stripe-payment-form"
      data-client-secret={clientSecret}
      data-payment-intent-id={paymentIntentId}
    />
  ),
}));

vi.mock("@/lib", async () => {
  const actual = await vi.importActual<typeof import("@/lib")>("@/lib");
  return {
    ...actual,
    getCartItems: () => [{ id: "1", name: "Burger", price: actual.price(10.0), quantity: actual.quantity(1) }],
  };
});

describe("CheckoutRoute", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("passes paymentIntentId from API response to StripePaymentForm", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          clientSecret: "pi_abc123_secret_def456",
          paymentIntentId: "pi_abc123",
        }),
    });

    const { default: CheckoutRoute } = await import("./page");
    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument();
    });

    const form = screen.getByTestId("stripe-payment-form");
    expect(form.dataset.paymentIntentId).toBe("pi_abc123");
  });

  it("does not derive paymentIntentId by parsing client_secret", async () => {
    // Use a clientSecret where split("_secret_")[0] would give the WRONG id
    // to prove the code uses the API-provided paymentIntentId, not a parsed one
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          clientSecret: "pi_wrong_id_secret_xyz",
          paymentIntentId: "pi_correct_id",
        }),
    });

    const { default: CheckoutRoute } = await import("./page");
    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument();
    });

    const form = screen.getByTestId("stripe-payment-form");
    // If the code parses client_secret, it would get "pi_wrong_id" instead of "pi_correct_id"
    expect(form.dataset.paymentIntentId).toBe("pi_correct_id");
  });
});
