import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLoginPage from "./page";

const mockLogin = vi.fn();
const mockPush = vi.fn();

vi.mock("@/app/admin/login/actions", () => ({
  login: (...args: unknown[]) => mockLogin(...args),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

test("renders email input, password input, and log in button", () => {
  render(<AdminLoginPage />);

  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
});

test("calls login action with email and password when form is submitted", async () => {
  mockLogin.mockResolvedValueOnce({ success: false, error: "Invalid email or password" });
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

test("displays error message when login returns failure", async () => {
  mockLogin.mockResolvedValueOnce({
    success: false,
    error: "Invalid email or password",
  });

  const user = userEvent.setup();
  render(<AdminLoginPage />);

  await user.type(screen.getByLabelText("Email"), "wrong@example.com");
  await user.type(screen.getByLabelText("Password"), "wrongpassword");
  await user.click(screen.getByRole("button", { name: "Log in" }));

  expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
});

test("redirects to /admin when login returns success", async () => {
  mockLogin.mockResolvedValueOnce({ success: true });

  const user = userEvent.setup();
  render(<AdminLoginPage />);

  await user.type(screen.getByLabelText("Email"), "admin@example.com");
  await user.type(screen.getByLabelText("Password"), "secret123");
  await user.click(screen.getByRole("button", { name: "Log in" }));

  expect(mockPush).toHaveBeenCalledWith("/admin");
});
