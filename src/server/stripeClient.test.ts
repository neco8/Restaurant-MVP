import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("stripe", () => {
  function MockStripe() {}
  return { default: MockStripe };
});

vi.mock("https-proxy-agent", () => ({
  HttpsProxyAgent: vi.fn(),
}));

describe("createStripeClient", () => {
  const originalKey = process.env.STRIPE_SECRET_KEY;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY;
    } else {
      process.env.STRIPE_SECRET_KEY = originalKey;
    }
  });

  it("throws a descriptive error when STRIPE_SECRET_KEY is not set", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const { createStripeClient } = await import("./stripeClient");
    expect(() => createStripeClient()).toThrow(
      "STRIPE_SECRET_KEY environment variable is not set"
    );
  });
});
