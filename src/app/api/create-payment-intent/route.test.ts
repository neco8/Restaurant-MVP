import { vi, describe, it, expect, beforeEach } from "vitest";
import { price } from "@/lib/price";

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

const mockFindAll = vi.fn();
vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: () => ({ findAll: mockFindAll }),
}));

describe("POST /api/create-payment-intent", () => {
  beforeEach(() => {
    vi.resetModules();
    mockCreate.mockClear();
    mockCreate.mockResolvedValue({
      id: "pi_test_123",
      client_secret: "pi_test_123_secret_xxx",
    });
    mockFindAll.mockResolvedValue([
      { id: "1", name: "Ramen", price: price(12.00), description: "Rich tonkotsu broth" },
      { id: "2", name: "Gyoza", price: price(7.50), description: "Pan-fried pork dumplings" },
    ]);
    process.env.STRIPE_SECRET_KEY = "sk_test_fake";
  });

  it("returns clientSecret from PaymentIntent", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: [{ id: "1", quantity: 1 }] }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.clientSecret).toBe("pi_test_123_secret_xxx");
  });

  it("returns paymentIntentId from PaymentIntent", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: [{ id: "1", quantity: 1 }] }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(body.paymentIntentId).toBe("pi_test_123");
  });

  it("passes amount and currency to Stripe", async () => {
    const { POST } = await import("./route");

    const request = new Request("http://localhost/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: [{ id: "1", quantity: 1 }] }),
    });

    await POST(request);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1200, currency: "usd" })
    );
  });

  describe("server-side amount validation", () => {
    it("returns 400 when cartItems is missing from request body", async () => {
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInCents: 1200 }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when cartItems is an empty array", async () => {
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: [] }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when cartItems contains an unknown product id", async () => {
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: [{ id: "unknown-999", quantity: 1 }] }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("creates PaymentIntent using server-side price, ignoring client-provided amountInCents", async () => {
      // Ramen costs $12.00 = 1200 cents server-side.
      // A malicious client claims to owe only $0.01 = 1 cent.
      // The server must ignore the tampered amountInCents and charge the real price.
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [{ id: "1", quantity: 1 }],
          amountInCents: 1,
        }),
      });

      await POST(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 1200 })
      );
    });

    it("computes correct total for multiple cart items using server-side prices", async () => {
      // Ramen $12.00 + Gyoza $7.50 = $19.50 = 1950 cents
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [
            { id: "1", quantity: 1 },
            { id: "2", quantity: 1 },
          ],
        }),
      });

      await POST(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 1950 })
      );
    });

    it("computes correct total when quantity is greater than one", async () => {
      // Gyoza $7.50 × 2 = $15.00 = 1500 cents
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [{ id: "2", quantity: 2 }],
        }),
      });

      await POST(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 1500 })
      );
    });

    it("returns 400 when quantity is a fraction (e.g. 0.5)", async () => {
      // BUG: A malicious client sends quantity: 0.5 for Ramen ($12.00).
      // Expected: server rejects non-integer quantity with 400.
      // Actual: server accepts it and charges $6.00 instead of $12.00.
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [{ id: "1", quantity: 0.5 }],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when quantity is zero", async () => {
      // BUG: quantity: 0 should be rejected but server processes it.
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [{ id: "1", quantity: 0 }],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when quantity is negative", async () => {
      // BUG: negative quantity reduces the total, allowing attacker to
      // offset another item's cost.
      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [{ id: "1", quantity: -1 }],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe("error handling", () => {
    it("returns 400 when request body is not valid JSON", async () => {
      const { POST } = await import("./route");
      const request = new Request(
        "http://localhost/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "not-valid-json{{{",
        }
      );

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 500 when Stripe throws an error", async () => {
      mockCreate.mockRejectedValueOnce(new Error("Stripe network error"));
      const { POST } = await import("./route");
      const request = new Request(
        "http://localhost/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems: [{ id: "1", quantity: 1 }] }),
        }
      );

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it("returns 402 with Stripe message when Stripe throws a card_error", async () => {
      const cardError = new Error("Your card was declined.");
      Object.assign(cardError, { type: "StripeCardError", rawType: "card_error" });
      mockCreate.mockRejectedValueOnce(cardError);
      const { POST } = await import("./route");
      const request = new Request(
        "http://localhost/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems: [{ id: "1", quantity: 1 }] }),
        }
      );

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(402);
      expect(body.error).toBe("Your card was declined.");
    });
  });
});
