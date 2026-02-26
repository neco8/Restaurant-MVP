import MenuList from "@/components/MenuList";
import { getProducts } from "@/lib";
import { defaultProductRepository } from "@/server/productRepository";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const products = await getProducts(defaultProductRepository());
  return <MenuList products={products} />;
}
