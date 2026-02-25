import { render, screen, waitFor } from "@testing-library/react";
import { getCartItems } from "@/lib";
import CheckoutRoute, { CheckoutPage } from "./page";

vi.mock("@/lib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib")>();
  return {
    ...actual,
    getCartItems: vi.fn().mockReturnValue([]),
  };
});

vi.mock("@/components/StripePaymentForm", () => ({
  StripePaymentForm: ({ clientSecret }: { clientSecret: string }) => (
    <div data-testid="stripe-payment-form">{clientSecret}</div>
  ),
}));

// ── CheckoutPage (pure component, no side-effects) ──────────────────────────

test("shows Checkout heading", () => {
  render(<CheckoutPage />);
  expect(screen.getByRole("heading", { name: "Checkout" })).toBeInTheDocument();
});

test("shows Place Order button", () => {
  render(<CheckoutPage />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
});

test("shows Order Summary heading", () => {
  render(<CheckoutPage />);
  expect(screen.getByRole("heading", { name: "Order Summary" })).toBeInTheDocument();
});

test("shows empty cart message when no items", () => {
  render(<CheckoutPage />);
  expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
});

test("shows item name when cart has one item", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.getByText("Burger")).toBeInTheDocument();
});

test("shows item price when cart has one item", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.getByText("$9.99")).toBeInTheDocument();
});

test("Place Order button is disabled when cart is empty", () => {
  render(<CheckoutPage />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeDisabled();
});

test("Place Order button is enabled when cart has items", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeEnabled();
});

test("shows item quantity when greater than one", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 2 }]} />);
  expect(screen.getByText("×2")).toBeInTheDocument();
});

test("does not show quantity badge when quantity is one", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.queryByText("×1")).not.toBeInTheDocument();
});

test("total reflects quantity", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 2 }]} />);
  expect(screen.getByText("Total: $19.98")).toBeInTheDocument();
});

test("shows line total for item with quantity greater than one", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 2 }]} />);
  expect(screen.getByText("$19.98")).toBeInTheDocument();
});

test("shows order total for multiple items", () => {
  render(
    <CheckoutPage
      cartItems={[
        { id: "1", name: "Burger", price: 9.99, quantity: 1 },
        { id: "2", name: "Fries", price: 3.49, quantity: 1 },
      ]}
    />
  );
  expect(screen.getByText("Total: $13.48")).toBeInTheDocument();
});

test("checkout total section has checkout-total testid", () => {
  render(<CheckoutPage cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]} />);
  expect(screen.getByTestId("checkout-total")).toBeInTheDocument();
});

test("shows loading indicator when loading is true", () => {
  render(
    <CheckoutPage
      cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]}
      loading={true}
    />
  );
  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByText("Preparing payment…")).toBeInTheDocument();
});

test("does not show loading indicator when loading is false", () => {
  render(
    <CheckoutPage
      cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]}
      loading={false}
    />
  );
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("does not show Place Order button when loading", () => {
  render(
    <CheckoutPage
      cartItems={[{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]}
      loading={true}
    />
  );
  expect(screen.queryByRole("button", { name: "Place Order" })).not.toBeInTheDocument();
});

// ── CheckoutRoute (reads localStorage, fetches payment intent) ───────────────
//
// These tests cover the rendering logic that is currently duplicated
// verbatim between CheckoutPage and CheckoutRoute.  They exist to make it
// safe to refactor CheckoutRoute so that it delegates order-summary
// rendering to CheckoutPage instead of carrying its own copy.

describe("CheckoutRoute", () => {
  beforeEach(() => {
    vi.mocked(getCartItems).mockReturnValue([]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ clientSecret: "pi_test_secret_abc" }),
      })
    );
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

  test("shows item name from localStorage cart", async () => {
    vi.mocked(getCartItems).mockReturnValue([{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("Burger")).toBeInTheDocument());
  });

  test("shows item price from localStorage cart", async () => {
    vi.mocked(getCartItems).mockReturnValue([{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("$9.99")).toBeInTheDocument());
  });

  test("shows quantity badge when quantity is greater than one", async () => {
    vi.mocked(getCartItems).mockReturnValue([{ id: "1", name: "Burger", price: 9.99, quantity: 2 }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("×2")).toBeInTheDocument());
  });

  test("does not show quantity badge when quantity is one", async () => {
    vi.mocked(getCartItems).mockReturnValue([{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.queryByText("×1")).not.toBeInTheDocument());
  });

  test("shows order total for multiple items", async () => {
    vi.mocked(getCartItems).mockReturnValue([
      { id: "1", name: "Burger", price: 9.99, quantity: 1 },
      { id: "2", name: "Fries", price: 3.49, quantity: 1 },
    ]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("Total: $13.48")).toBeInTheDocument());
  });

  test("checkout total section has checkout-total testid", async () => {
    vi.mocked(getCartItems).mockReturnValue([{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByTestId("checkout-total")).toBeInTheDocument());
  });

  test("shows StripePaymentForm once payment intent is fetched", async () => {
    vi.mocked(getCartItems).mockReturnValue([{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument());
  });

  test("replaces Place Order button with StripePaymentForm after payment intent is fetched", async () => {
    vi.mocked(getCartItems).mockReturnValue([{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]);
    render(<CheckoutRoute />);
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Place Order" })).not.toBeInTheDocument()
    );
  });
});

// ── CheckoutRoute — payment intent fetch error handling ──────────────────────

describe("CheckoutRoute - payment intent fetch error handling", () => {
  beforeEach(() => {
    vi.mocked(getCartItems).mockReturnValue([{ id: "1", name: "Burger", price: 9.99, quantity: 1 }]);
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
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "Internal Server Error" }),
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
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "Internal Server Error" }),
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
