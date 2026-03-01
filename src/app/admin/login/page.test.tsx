import { render, screen } from "@testing-library/react";
import AdminLoginPage from "./page";

test("renders email input, password input, and log in button", () => {
  render(<AdminLoginPage />);

  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
});
