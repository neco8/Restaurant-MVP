import MenuList from "@/components/MenuList";
import { getProducts } from "@/lib";
import { defaultProductRepository } from "@/server/productRepository";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  try {
    const products = await getProducts(defaultProductRepository());
    return <MenuList products={products} />;
  } catch {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-10">Menu</h1>
        <p className="text-red-600">Failed to load menu. Please try again later.</p>
      </div>
    );
  }
}
