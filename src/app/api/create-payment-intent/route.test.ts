import { vi, describe, it, expect, beforeEach } from "vitest";

const mockCreate = vi.fn().mockResolvedValue({
  id: "pi_test_123",
  client_secret: "pi_test_123_secret_xxx",
});

vi.mock("stripe", () => {
  function MockStripe() {
    return { paymentIntents: { create: mockCreate } };
  }
  return { default: MockStripe };
});

describe("POST /api/create-payment-intent", () => {
  beforeEach(() => {
    vi.resetModules();
    mockCreate.mockResolvedValue({
      id: "pi_test_123",
      client_secret: "pi_test_123_secret_xxx",
    });
    process.env.STRIPE_SECRET_KEY = "sk_test_fake";
  });

  it("returns clientSecret from PaymentIntent", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountInCents: 1200 }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.clientSecret).toBe("pi_test_123_secret_xxx");
  });

  it("passes amount and currency to Stripe", async () => {
    const { POST } = await import("./route");

    const request = new Request("http://localhost/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountInCents: 1200 }),
    });

    await POST(request);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1200, currency: "usd" })
    );
  });
});
