import MenuList from "@/components/MenuList";
import type { Product } from "@/lib";

type Props = {
  getProducts?: () => Promise<Product[]>;
};

export default async function MenuPage({ getProducts }: Props = {}) {
  const products = getProducts ? await getProducts() : [];
  return <MenuList products={products} />;
}
