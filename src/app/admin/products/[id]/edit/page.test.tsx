import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProductPage from "./page";

const mockUpdateProductAction = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "42" }),
}));

vi.mock("../../actions", () => ({
  updateProductAction: (...args: unknown[]) => mockUpdateProductAction(...args),
}));

beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = vi.fn();
});

test("calls updateProductAction with correct data when submitted", async () => {
  const user = userEvent.setup();
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ name: "Ramen", description: "Tonkotsu", price: 12.0 }),
  } as Response);

  render(<EditProductPage />);

  await waitFor(() => {
    expect(screen.getByLabelText("Name")).toHaveValue("Ramen");
  });

  await user.clear(screen.getByLabelText("Name"));
  await user.type(screen.getByLabelText("Name"), "Updated Ramen");
  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(mockUpdateProductAction).toHaveBeenCalledWith("42", {
    name: "Updated Ramen",
    description: "Tonkotsu",
    price: 12,
  });
});
