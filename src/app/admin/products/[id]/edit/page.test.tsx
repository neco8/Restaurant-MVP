import { render, waitFor } from "@testing-library/react";
import AdminEditProductPage from "./page";
import { ROUTES } from "@/lib";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "nonexistent-id" }),
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
