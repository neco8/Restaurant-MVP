import MenuList from "@/components/MenuList";
import type { Product } from "@/lib";
import { getProducts, defaultProductRepository } from "@/lib";

type Props = {
  getProducts?: () => Promise<Product[]>;
};

export default async function MenuPage({ getProducts: getProductsFn }: Props = {}) {
  const products = getProductsFn
    ? await getProductsFn()
    : await getProducts(defaultProductRepository());
  return <MenuList products={products} />;
}
