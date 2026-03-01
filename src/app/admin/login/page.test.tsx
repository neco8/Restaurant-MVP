import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLoginPage from "./page";

const mockLogin = vi.fn();

vi.mock("@/app/admin/login/actions", () => ({
  login: (...args: unknown[]) => mockLogin(...args),
}));

test("renders email input, password input, and log in button", () => {
  render(<AdminLoginPage />);

  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
});

test("calls login action with email and password when form is submitted", async () => {
  const user = userEvent.setup();
  render(<AdminLoginPage />);

  await user.type(screen.getByLabelText("Email"), "admin@example.com");
  await user.type(screen.getByLabelText("Password"), "secret123");
  await user.click(screen.getByRole("button", { name: "Log in" }));

  expect(mockLogin).toHaveBeenCalledWith({
    email: "admin@example.com",
    password: "secret123",
  });
});
