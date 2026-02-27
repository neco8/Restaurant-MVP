import { test, expect } from "@playwright/test";

test.describe("Homepage — Renge Japanese-Chinese Restaurant", () => {
  test("displays restaurant name and navigates to menu", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /renge/i })
    ).toBeVisible();

    await expect(page.getByText("蓮華")).toBeVisible();

    await expect(
      page.getByText(/classical japanese-chinese cuisine/i)
    ).toBeVisible();

    const menuLink = page.getByRole("link", { name: /menu/i });
    await expect(menuLink).toBeVisible();

    await expect(
      page.getByRole("link", { name: /cart/i })
    ).toBeVisible();

    await expect(page.getByText(/黒酢酢豚/)).toBeVisible();
    await expect(page.getByText(/海老のチリソース/)).toBeVisible();
    await expect(page.getByText(/白胡麻担々麺/)).toBeVisible();
    await expect(page.getByText(/陳麻婆豆腐/)).toBeVisible();
    await expect(page.getByText(/北京烤鴨/)).toBeVisible();

    await menuLink.click();
    await expect(page).toHaveURL("/menu");
  });
});
