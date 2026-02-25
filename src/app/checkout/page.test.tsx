import { render, screen, waitFor } from "@testing-library/react";
import { getStoredCartItems } from "@/lib";
import { quantity } from "@/lib/quantity";
import { price } from "@/lib/price";
import CheckoutRoute from "./page";
import { CheckoutView } from "./CheckoutView";

vi.mock("@/lib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib")>();
  return {
    ...actual,
    getStoredCartItems: vi.fn().mockReturnValue([]),
  };
});

vi.mock("@/components/StripePaymentForm", () => ({
  StripePaymentForm: ({ clientSecret }: { clientSecret: string }) => (
    <div data-testid="stripe-payment-form">{clientSecret}</div>
  ),
}));

// ── CheckoutView (pure presentational view, no side-effects) ────────────────

test("shows Checkout heading", () => {
  render(<CheckoutView />);
  expect(screen.getByRole("heading", { name: "Checkout" })).toBeInTheDocument();
});

test("shows Place Order button", () => {
  render(<CheckoutView />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
});

test("shows Order Summary heading", () => {
  render(<CheckoutView />);
  expect(screen.getByRole("heading", { name: "Order Summary" })).toBeInTheDocument();
});

test("shows empty cart message when no items", () => {
  render(<CheckoutView />);
  expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
});

test("shows item name when cart has one item", () => {
  render(<CheckoutView cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) }]} />);
  expect(screen.getByText("Burger")).toBeInTheDocument();
});

test("shows item price when cart has one item", () => {
  render(<CheckoutView cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) }]} />);
  expect(screen.getByText("$9.99")).toBeInTheDocument();
});

test("Place Order button is disabled when cart is empty", () => {
  render(<CheckoutView />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeDisabled();
});

test("Place Order button is enabled when cart has items", () => {
  render(<CheckoutView cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) }]} />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeEnabled();
});

test("shows item quantity when greater than one", () => {
  render(<CheckoutView cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(2) }]} />);
  expect(screen.getByText("×2")).toBeInTheDocument();
});

test("does not show quantity badge when quantity is one", () => {
  render(<CheckoutView cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) }]} />);
  expect(screen.queryByText("×1")).not.toBeInTheDocument();
});

test("total reflects quantity", () => {
  render(<CheckoutView cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(2) }]} />);
  expect(screen.getByText("Total: $19.98")).toBeInTheDocument();
});

test("shows line total for item with quantity greater than one", () => {
  render(<CheckoutView cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(2) }]} />);
  expect(screen.getByText("$19.98")).toBeInTheDocument();
});

test("shows order total for multiple items", () => {
  render(
    <CheckoutView
      cartItems={[
        { id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) },
        { id: "2", name: "Fries", price: price(3.49), quantity: quantity(1) },
      ]}
    />
  );
  expect(screen.getByText("Total: $13.48")).toBeInTheDocument();
});

test("checkout total section has checkout-total testid", () => {
  render(<CheckoutView cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) }]} />);
  expect(screen.getByTestId("checkout-total")).toBeInTheDocument();
});

test("shows loading indicator when loading is true", () => {
  render(
    <CheckoutView
      cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) }]}
      loading={true}
    />
  );
  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByText("Preparing payment…")).toBeInTheDocument();
});

test("does not show loading indicator when loading is false", () => {
  render(
    <CheckoutView
      cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) }]}
      loading={false}
    />
  );
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("does not show Place Order button when loading", () => {
  render(
    <CheckoutView
      cartItems={[{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1) }]}
      loading={true}
    />
  );
  expect(screen.queryByRole("button", { name: "Place Order" })).not.toBeInTheDocument();
});

// ── CheckoutRoute (reads localStorage, fetches products + payment intent) ────

function mockFetchForRoute() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((url: string) => {
      if (url === "/api/products") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: "1", name: "Burger", price: 9.99, description: "Tasty burger" },
              { id: "2", name: "Fries", price: 3.49, description: "Crispy fries" },
            ]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ clientSecret: "pi_test_secret_abc", paymentIntentId: "pi_test_123" }),
      });
    })
  );
}

describe("CheckoutRoute", () => {
  beforeEach(() => {
    vi.mocked(getStoredCartItems).mockReturnValue([]);
    mockFetchForRoute();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("renders Checkout heading", () => {
    render(<CheckoutRoute />);
    expect(screen.getByRole("heading", { name: "Checkout" })).toBeInTheDocument();
  });

  test("renders Order Summary heading", () => {
    render(<CheckoutRoute />);
    expect(screen.getByRole("heading", { name: "Order Summary" })).toBeInTheDocument();
  });

  test("shows empty cart message when localStorage is empty", () => {
    render(<CheckoutRoute />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  test("shows Place Order button while cart is empty", () => {
    render(<CheckoutRoute />);
    expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
  });

  test("Place Order button is disabled while cart is empty", () => {
    render(<CheckoutRoute />);
    expect(screen.getByRole("button", { name: "Place Order" })).toBeDisabled();
  });

  test("shows item name from server products", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1) }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("Burger")).toBeInTheDocument());
  });

  test("shows item price from server products", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1) }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("$9.99")).toBeInTheDocument());
  });

  test("shows quantity badge when quantity is greater than one", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(2) }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("×2")).toBeInTheDocument());
  });

  test("does not show quantity badge when quantity is one", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1) }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.queryByText("×1")).not.toBeInTheDocument());
  });

  test("shows order total for multiple items", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([
      { id: "1", quantity: quantity(1) },
      { id: "2", quantity: quantity(1) },
    ]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("Total: $13.48")).toBeInTheDocument());
  });

  test("checkout total section has checkout-total testid", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1) }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByTestId("checkout-total")).toBeInTheDocument());
  });

  test("shows StripePaymentForm once payment intent is fetched", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1) }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument());
  });

  test("replaces Place Order button with StripePaymentForm after payment intent is fetched", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1) }]);
    render(<CheckoutRoute />);
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Place Order" })).not.toBeInTheDocument()
    );
  });
});

// ── CheckoutRoute — payment intent fetch error handling ──────────────────────

describe("CheckoutRoute - payment intent fetch error handling", () => {
  beforeEach(() => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1) }]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("shows error message when network request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  test("error message text is user-friendly on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Something went wrong. Please try again."
      );
    });
  });

  test("shows error message when server returns a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url === "/api/products") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: "1", name: "Burger", price: 9.99, description: "Tasty" }]),
          });
        }
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: "Internal Server Error" }),
        });
      })
    );

    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  test("error message text is user-friendly on server error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url === "/api/products") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: "1", name: "Burger", price: 9.99, description: "Tasty" }]),
          });
        }
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: "Internal Server Error" }),
        });
      })
    );

    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Something went wrong. Please try again."
      );
    });
  });
});
