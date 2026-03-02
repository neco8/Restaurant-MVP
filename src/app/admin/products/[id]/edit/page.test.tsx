import { render, screen, waitFor } from "@testing-library/react";
import AdminEditProductPage from "./page";
import { ROUTES } from "@/lib";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "product-123" }),
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => {
  mockPush.mockReset();
  vi.restoreAllMocks();
});

describe("AdminEditProductPage error handling", () => {
  test("redirects to admin products when GET returns 404", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
    );

    render(<AdminEditProductPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(ROUTES.ADMIN_PRODUCTS);
    });
  });
});

describe("AdminEditProductPage data loading", () => {
  test("populates form fields with fetched product data", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ name: "Ramen", description: "Rich broth", price: 18.5 }),
        { status: 200 }
      )
    );

    render(<AdminEditProductPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ramen")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Rich broth")).toBeInTheDocument();
      expect(screen.getByDisplayValue("18.5")).toBeInTheDocument();
    });
  });
});
