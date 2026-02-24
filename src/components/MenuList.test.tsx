import { render, screen } from "@testing-library/react";
import MenuList from "./MenuList";

test("shows メニュー heading", () => {
  render(<MenuList products={[]} />);
  expect(
    screen.getByRole("heading", { name: "メニュー" })
  ).toBeInTheDocument();
});
