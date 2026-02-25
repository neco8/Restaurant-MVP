import { render, screen } from "@testing-library/react";
import Home from "./page";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

test("shows Menu link to /menu", () => {
  render(<Home />);
  const link = screen.getByRole("link", { name: "Menu" });
  expect(link).toHaveAttribute("href", "/menu");
});
