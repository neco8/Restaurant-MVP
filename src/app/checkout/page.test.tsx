import { render, screen, waitFor } from "@testing-library/react";
import { getStoredCartItems } from "@/lib";
import { quantity } from "@/lib/quantity";
import { price } from "@/lib/price";
import type { CartState } from "@/lib";
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

const loaded = (items: CartState & { status: "loaded" } extends { items: infer I } ? I : never): CartState => ({
  status: "loaded",
  items,
});

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

test("shows empty cart message when loaded with no items", () => {
  render(<CheckoutView cartState={loaded([])} />);
  expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
});

test("does not show empty cart message when loading with stored items", () => {
  render(
    <CheckoutView
      cartState={{ status: "loading", storedItems: [{ id: "1", quantity: quantity(1)._unsafeUnwrap() }] }}
    />
  );
  expect(screen.queryByText("Your cart is empty")).not.toBeInTheDocument();
});

test("shows loading indicator when loading with stored items", () => {
  render(
    <CheckoutView
      cartState={{ status: "loading", storedItems: [{ id: "1", quantity: quantity(1)._unsafeUnwrap() }] }}
    />
  );
  expect(screen.getByRole("status")).toBeInTheDocument();
});

test("shows item name when cart has one item", () => {
  render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])} />);
  expect(screen.getByText("Burger")).toBeInTheDocument();
});

test("shows item price when cart has one item", () => {
  render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])} />);
  expect(screen.getByText("$9.99")).toBeInTheDocument();
});

test("Place Order button is disabled when cart is empty", () => {
  render(<CheckoutView cartState={loaded([])} />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeDisabled();
});

test("Place Order button is enabled when cart has items", () => {
  render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])} />);
  expect(screen.getByRole("button", { name: "Place Order" })).toBeEnabled();
});

test("shows item quantity when greater than one", () => {
  render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(2)._unsafeUnwrap() }])} />);
  expect(screen.getByText("×2")).toBeInTheDocument();
});

test("does not show quantity badge when quantity is one", () => {
  render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])} />);
  expect(screen.queryByText("×1")).not.toBeInTheDocument();
});

test("total reflects quantity", () => {
  render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(2)._unsafeUnwrap() }])} />);
  expect(screen.getByText("Total: $19.98")).toBeInTheDocument();
});

test("shows line total for item with quantity greater than one", () => {
  render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(2)._unsafeUnwrap() }])} />);
  expect(screen.getByText("$19.98")).toBeInTheDocument();
});

test("shows order total for multiple items", () => {
  render(
    <CheckoutView
      cartState={loaded([
        { id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() },
        { id: "2", name: "Fries", price: price(3.49), quantity: quantity(1)._unsafeUnwrap() },
      ])}
    />
  );
  expect(screen.getByText("Total: $13.48")).toBeInTheDocument();
});

test("checkout total section has checkout-total testid", () => {
  render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])} />);
  expect(screen.getByTestId("checkout-total")).toBeInTheDocument();
});

test("shows loading indicator when loading is true", () => {
  render(
    <CheckoutView
      cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])}
      loading={true}
    />
  );
  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByText("Preparing payment…")).toBeInTheDocument();
});

test("does not show loading indicator when loading is false", () => {
  render(
    <CheckoutView
      cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])}
      loading={false}
    />
  );
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("does not show Place Order button when loading", () => {
  render(
    <CheckoutView
      cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])}
      loading={true}
    />
  );
  expect(screen.queryByRole("button", { name: "Place Order" })).not.toBeInTheDocument();
});

describe("CheckoutView structure", () => {
  test("renders exactly two headings", () => {
    render(<CheckoutView />);
    expect(screen.getAllByRole("heading")).toHaveLength(2);
  });

  test("heading levels are h1 and h2", () => {
    render(<CheckoutView />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  test("h1 text is Checkout", () => {
    render(<CheckoutView />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Checkout");
  });

  test("h2 text is Order Summary", () => {
    render(<CheckoutView />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Order Summary");
  });

  test("renders exactly one button in empty state", () => {
    render(<CheckoutView />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  test("renders order summary list when items present", () => {
    render(<CheckoutView cartState={loaded([{ id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }])} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test("renders one list item per cart item", () => {
    render(
      <CheckoutView
        cartState={loaded([
          { id: "1", name: "Burger", price: price(9.99), quantity: quantity(1)._unsafeUnwrap() },
          { id: "2", name: "Fries", price: price(3.49), quantity: quantity(1)._unsafeUnwrap() },
        ])}
      />
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
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

  test("shows empty cart message when localStorage is empty", async () => {
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("Your cart is empty")).toBeInTheDocument());
  });

  test("shows Place Order button while cart is empty", async () => {
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument());
  });

  test("Place Order button is disabled while cart is empty", async () => {
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Place Order" })).toBeDisabled());
  });

  test("shows item name from server products", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1)._unsafeUnwrap() }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("Burger")).toBeInTheDocument());
  });

  test("shows item price from server products", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1)._unsafeUnwrap() }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("$9.99")).toBeInTheDocument());
  });

  test("shows quantity badge when quantity is greater than one", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(2)._unsafeUnwrap() }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("×2")).toBeInTheDocument());
  });

  test("does not show quantity badge when quantity is one", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1)._unsafeUnwrap() }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.queryByText("×1")).not.toBeInTheDocument());
  });

  test("shows order total for multiple items", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([
      { id: "1", quantity: quantity(1)._unsafeUnwrap() },
      { id: "2", quantity: quantity(1)._unsafeUnwrap() },
    ]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByText("Total: $13.48")).toBeInTheDocument());
  });

  test("checkout total section has checkout-total testid", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1)._unsafeUnwrap() }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByTestId("checkout-total")).toBeInTheDocument());
  });

  test("shows StripePaymentForm once payment intent is fetched", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1)._unsafeUnwrap() }]);
    render(<CheckoutRoute />);
    await waitFor(() => expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument());
  });

  test("replaces Place Order button with StripePaymentForm after payment intent is fetched", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1)._unsafeUnwrap() }]);
    render(<CheckoutRoute />);
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Place Order" })).not.toBeInTheDocument()
    );
  });
});

// ── CheckoutRoute — payment intent fetch error handling ──────────────────────

describe("CheckoutRoute - payment intent fetch error handling", () => {
  beforeEach(() => {
    vi.mocked(getStoredCartItems).mockReturnValue([{ id: "1", quantity: quantity(1)._unsafeUnwrap() }]);
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

  test("shows server-provided error message when API returns an error field", async () => {
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
          json: () => Promise.resolve({ error: "Your card was declined." }),
        });
      })
    );

    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Your card was declined."
      );
    });
  });

  test("falls back to generic message when network request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Something went wrong. Please try again."
      );
    });
  });

  test("still shows order summary when payment intent fails", async () => {
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
      expect(screen.getByText("Burger")).toBeInTheDocument();
    });
  });
});

// ── CheckoutRoute — stale cart items ─────────────────────────────────────────

describe("CheckoutRoute - stale cart items", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("creates payment intent with only valid items when cart has stale product ids", async () => {
    vi.mocked(getStoredCartItems).mockReturnValue([
      { id: "1", quantity: quantity(1)._unsafeUnwrap() },
      { id: "stale-id", quantity: quantity(1)._unsafeUnwrap() },
    ]);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string, options?: RequestInit) => {
        if (url === "/api/products") {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve([
                { id: "1", name: "Burger", price: 9.99, description: "Tasty burger" },
              ]),
          });
        }
        // Simulate server-side product validation
        const body = JSON.parse(options?.body as string);
        const unknownItem = body.cartItems.find(
          (item: { id: string }) => !["1", "2"].includes(item.id)
        );
        if (unknownItem) {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: "Unknown product id" }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ clientSecret: "pi_test_secret_abc", paymentIntentId: "pi_test_123" }),
        });
      })
    );

    render(<CheckoutRoute />);

    await waitFor(() => {
      expect(screen.getByTestId("stripe-payment-form")).toBeInTheDocument();
    });
  });
});
