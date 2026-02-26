import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "./ProductForm";

test("renders name, description, price fields and save button", () => {
  render(<ProductForm onSubmit={vi.fn()} />);
  expect(screen.getByLabelText("Name")).toBeInTheDocument();
  expect(screen.getByLabelText("Description")).toBeInTheDocument();
  expect(screen.getByLabelText("Price")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});

test("calls onSubmit with form data when submitted", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ProductForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Name"), "Udon");
  await user.type(screen.getByLabelText("Description"), "Thick noodles");
  await user.type(screen.getByLabelText("Price"), "10.00");
  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(onSubmit).toHaveBeenCalledWith({
    name: "Udon",
    description: "Thick noodles",
    price: "10.00",
  });
});

test("renders with initial values when provided", () => {
  render(
    <ProductForm
      onSubmit={vi.fn()}
      initialValues={{ name: "Ramen", description: "Tonkotsu", price: "12.00" }}
    />
  );
  expect(screen.getByLabelText("Name")).toHaveValue("Ramen");
  expect(screen.getByLabelText("Description")).toHaveValue("Tonkotsu");
  expect(screen.getByLabelText("Price")).toHaveValue("12.00");
});
