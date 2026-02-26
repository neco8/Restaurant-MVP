import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("@/components/StripePaymentForm", () => ({
  StripePaymentForm: ({
    clientSecret,
    paymentIntentId,
    email,
  }: {
    clientSecret: string;
    paymentIntentId: string;
    email?: string;
  }) => (
    <div
      data-testid="stripe-payment-form"
      data-client-secret={clientSecret}
      data-payment-intent-id={paymentIntentId}
      data-email={email}
    />
  ),
}));

vi.mock("@/lib", async () => {
  const actual = await vi.importActual<typeof import("@/lib")>("@/lib");
  return {
    ...actual,
    getStoredCartItems: () => [{ id: "1", quantity: actual.quantity(1)._unsafeUnwrap() }],
  };
});

function mockFetch(paymentResponse: { clientSecret: string; paymentIntentId: string }) {
  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (url === "/api/products") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: "1", name: "Burger", price: 10.0, description: "Tasty burger" },
        ]),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(paymentResponse),
    });
  });
}

describe("CheckoutRoute", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("passes paymentIntentId from API response to StripePaymentForm", async () => {
    mockFetch({
      clientSecret: "pi_abc123_secret_def456",
      paymentIntentId: "pi_abc123",
    });

    const { default: CheckoutRoute } = await import("./page");
    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument();
    });

    const form = screen.getByTestId("stripe-payment-form");
    expect(form.dataset.paymentIntentId).toBe("pi_abc123");
  });

  it("passes email to StripePaymentForm", async () => {
    mockFetch({
      clientSecret: "pi_abc123_secret_def456",
      paymentIntentId: "pi_abc123",
    });

    const { default: CheckoutRoute } = await import("./page");
    render(<CheckoutRoute />);

    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    await waitFor(() => {
      expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument();
    });

    const form = screen.getByTestId("stripe-payment-form");
    expect(form.dataset.email).toBe("test@example.com");
  });

  it("does not derive paymentIntentId by parsing client_secret", async () => {
    mockFetch({
      clientSecret: "pi_wrong_id_secret_xyz",
      paymentIntentId: "pi_correct_id",
    });

    const { default: CheckoutRoute } = await import("./page");
    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument();
    });

    const form = screen.getByTestId("stripe-payment-form");
    expect(form.dataset.paymentIntentId).toBe("pi_correct_id");
  });
});
