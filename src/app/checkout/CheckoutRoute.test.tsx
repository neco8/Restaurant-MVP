import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("@/components/StripePaymentForm", () => ({
  StripePaymentForm: ({
    clientSecret,
  }: {
    clientSecret: string;
  }) => (
    <div
      data-testid="stripe-payment-form"
      data-client-secret={clientSecret}
    />
  ),
}));

vi.mock("@/lib", async () => {
  const actual = await vi.importActual<typeof import("@/lib")>("@/lib");
  return {
    ...actual,
    getCartItems: () => [{ id: "1", name: "Burger", price: 10.0, quantity: 1 }],
  };
});

describe("CheckoutRoute", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("passes clientSecret from API response to StripePaymentForm", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          clientSecret: "pi_abc123_secret_def456",
        }),
    });

    const { default: CheckoutRoute } = await import("./page");
    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument();
    });

    const form = screen.getByTestId("stripe-payment-form");
    expect(form.dataset.clientSecret).toBe("pi_abc123_secret_def456");
  });
});
