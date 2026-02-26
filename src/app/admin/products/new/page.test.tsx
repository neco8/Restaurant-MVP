import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewProductPage from "./page";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = vi.fn();
});

test("calls router.refresh after successful create to invalidate cache", async () => {
  const user = userEvent.setup();
  vi.mocked(global.fetch).mockResolvedValue({ ok: true } as Response);

  render(<NewProductPage />);

  await user.type(screen.getByLabelText("Name"), "Udon");
  await user.type(screen.getByLabelText("Price"), "10");
  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(mockRefresh).toHaveBeenCalled();
});
