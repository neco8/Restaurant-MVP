import { SIGNATURE_DISHES } from "../../src/lib/signatureDishes";

export type DemoProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export type DemoAdmin = {
  email: string;
  passwordHash: string;
};

function priceToCents(price: string): number {
  const dollars = parseInt(price.replace("$", ""), 10);
  return dollars * 100;
}

export const DEMO_PRODUCTS: DemoProduct[] = SIGNATURE_DISHES.map(
  (dish, index) => ({
    id: `demo-product-${index + 1}`,
    name: dish.english,
    description: dish.description,
    price: priceToCents(dish.price),
    image: dish.image,
  })
);

export const DEMO_ADMIN: DemoAdmin = {
  email: "demo-admin@example.com",
  passwordHash: "oauth-no-password",
};
