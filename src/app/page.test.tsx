import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page structure", () => {
  test("shows restaurant heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  test("shows Menu link to /menu", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /menu/i });
    expect(link).toHaveAttribute("href", "/menu");
  });

  test("shows Cart link to /cart", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /cart/i });
    expect(link).toHaveAttribute("href", "/cart");
  });
});
