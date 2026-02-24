import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test("should complete full checkout: shop → cart → checkout → confirmation", async ({
    page,
  }) => {
    // 1. メインページから商品一覧を開く
    await page.goto("/");
    await page.getByRole("link", { name: "メニュー" }).click();
    await expect(page).toHaveURL("/menu");

    // 商品一覧が表示されていることを確認
    await expect(
      page.getByRole("heading", { name: "メニュー" })
    ).toBeVisible();
    const productCards = page.getByTestId("product-card");
    await expect(productCards.first()).toBeVisible();

    // 2. 商品を一つ選択する → 3. 商品詳細ページに行く
    const firstProductName = await productCards
      .first()
      .getByTestId("product-name")
      .textContent();
    await productCards.first().click();
    await expect(page).toHaveURL(/\/menu\/.+/);

    // 商品詳細が表示されていることを確認
    await expect(
      page.getByRole("heading", { name: firstProductName! })
    ).toBeVisible();
    await expect(page.getByTestId("product-price")).toBeVisible();
    await expect(page.getByTestId("product-description")).toBeVisible();

    // 4. カートに入れる
    await page.getByRole("button", { name: "カートに入れる" }).click();

    // カートに追加されたフィードバックを確認
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    // 5. レジに進む
    await page.getByRole("link", { name: "カートを見る" }).click();
    await expect(page).toHaveURL("/cart");

    // カートに商品が入っていることを確認
    await expect(page.getByText(firstProductName!)).toBeVisible();
    await page.getByRole("link", { name: "レジに進む" }).click();
    await expect(page).toHaveURL("/checkout");

    // 6. 注文する
    await expect(
      page.getByRole("heading", { name: "お会計" })
    ).toBeVisible();
    await page.getByRole("button", { name: "注文する" }).click();

    // 7. 注文完了 → 8. 注文完了ページに行く
    await expect(page).toHaveURL(/\/orders\/.+\/complete/);
    await expect(
      page.getByRole("heading", { name: "ご注文ありがとうございます" })
    ).toBeVisible();
    await expect(page.getByTestId("order-id")).toBeVisible();
  });
});
