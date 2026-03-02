import MenuList from "@/components/MenuList";
import { defaultProductRepository } from "@/server/productRepository";

export default async function MenuPage() {
  const products = await defaultProductRepository().findAll();
  return <MenuList products={products} />;
}
