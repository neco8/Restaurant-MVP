import { render, screen } from "@testing-library/react";
import AdminLoginPage from "./page";

test("renders a Sign in with Google link", () => {
  render(<AdminLoginPage />);

  expect(
    screen.getByRole("link", { name: "Sign in with Google" })
  ).toBeInTheDocument();
});

test("Sign in with Google button links to /api/auth/google", () => {
  render(<AdminLoginPage />);

  const googleLink = screen.getByRole("link", { name: "Sign in with Google" });
  expect(googleLink).toHaveAttribute("href", "/api/auth/google");
});

test("does not render a password form", () => {
  render(<AdminLoginPage />);

  expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Log in" })).not.toBeInTheDocument();
});
