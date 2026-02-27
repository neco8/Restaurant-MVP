import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page — Renge Japanese-Chinese Restaurant", () => {
  test("shows restaurant name RENGE as heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/renge/i);
  });

  test("shows Japanese characters 蓮華", () => {
    render(<Home />);
    const elements = screen.getAllByText("蓮華");
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  test("shows tagline about classical Japanese-Chinese cuisine", () => {
    render(<Home />);
    expect(
      screen.getByText(/classical japanese-chinese cuisine/i)
    ).toBeInTheDocument();
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

  test("renders navigation element", () => {
    render(<Home />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("displays 5 signature dishes", () => {
    render(<Home />);
    expect(screen.getByText(/黒酢酢豚/)).toBeInTheDocument();
    expect(screen.getByText(/海老のチリソース/)).toBeInTheDocument();
    expect(screen.getByText(/白胡麻担々麺/)).toBeInTheDocument();
    expect(screen.getByText(/陳麻婆豆腐/)).toBeInTheDocument();
    expect(screen.getByText(/北京烤鴨/)).toBeInTheDocument();
  });

  test("displays English names for signature dishes", () => {
    render(<Home />);
    expect(screen.getByText(/black vinegar sweet & sour pork/i)).toBeInTheDocument();
    expect(screen.getByText(/chili prawns/i)).toBeInTheDocument();
    expect(screen.getByText(/white sesame tantanmen/i)).toBeInTheDocument();
    expect(screen.getByText(/heritage mapo tofu/i)).toBeInTheDocument();
    expect(screen.getByText(/peking duck/i)).toBeInTheDocument();
  });

  test("displays prices for signature dishes", () => {
    render(<Home />);
    expect(screen.getByText("$38")).toBeInTheDocument();
    expect(screen.getByText("$42")).toBeInTheDocument();
    expect(screen.getByText("$28")).toBeInTheDocument();
    expect(screen.getByText("$32")).toBeInTheDocument();
    expect(screen.getByText("$88")).toBeInTheDocument();
  });
});
