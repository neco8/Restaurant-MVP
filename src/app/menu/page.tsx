import MenuList from "@/components/MenuList";
import { getProducts } from "@/lib";
import type { Product } from "@/lib";
import { defaultProductRepository } from "@/server/productRepository";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  let products: Product[];
  try {
    products = await getProducts(defaultProductRepository());
  } catch {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-10">Menu</h1>
        <p>Failed to load menu items. Please try again later.</p>
      </div>
    );
  }
  return <MenuList products={products} />;
}
