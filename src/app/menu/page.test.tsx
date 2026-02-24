import { render, screen } from "@testing-library/react";
import MenuPage from "./page";

test("shows メニュー heading", async () => {
  const page = await MenuPage();
  render(page);
  expect(
    screen.getByRole("heading", { name: "メニュー" })
  ).toBeInTheDocument();
});
