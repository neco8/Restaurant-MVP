import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewProductPage from "./page";

const mockCreateProductAction = vi.fn();

vi.mock("../actions", () => ({
  createProductAction: (...args: unknown[]) => mockCreateProductAction(...args),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

test("calls createProductAction with form data when submitted", async () => {
  const user = userEvent.setup();

  render(<NewProductPage />);

  await user.type(screen.getByLabelText("Name"), "Udon");
  await user.type(screen.getByLabelText("Price"), "10");
  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(mockCreateProductAction).toHaveBeenCalledWith({
    name: "Udon",
    description: "",
    price: 10,
  });
});
