import MenuList from "@/components/MenuList";
import { defaultProductRepository } from "@/server/productRepository";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const products = await defaultProductRepository().findAll();
  return <MenuList products={products} />;
}
