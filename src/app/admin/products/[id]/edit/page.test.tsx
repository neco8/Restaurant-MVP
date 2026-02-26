import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProductPage from "./page";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useParams: () => ({ id: "42" }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = vi.fn();
});

test("calls router.refresh after successful update to invalidate cache", async () => {
  const user = userEvent.setup();
  vi.mocked(global.fetch)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Ramen", description: "Tonkotsu", price: 12.0 }),
    } as Response)
    .mockResolvedValueOnce({ ok: true } as Response);

  render(<EditProductPage />);

  await waitFor(() => {
    expect(screen.getByLabelText("Name")).toHaveValue("Ramen");
  });

  await user.clear(screen.getByLabelText("Name"));
  await user.type(screen.getByLabelText("Name"), "Updated Ramen");
  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(mockRefresh).toHaveBeenCalled();
});
