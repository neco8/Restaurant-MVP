import MenuList from "@/components/MenuList";
import { getProducts } from "@/lib";
import { defaultProductRepository } from "@/server/productRepository";

export default async function MenuPage() {
  const products = await getProducts(defaultProductRepository());
  return <MenuList products={products} />;
}
