import MenuList from "@/components/MenuList";
import { getProducts, defaultProductRepository } from "@/lib";

export default async function MenuPage() {
  const products = await getProducts(defaultProductRepository());
  return <MenuList products={products} />;
}
