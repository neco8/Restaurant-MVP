import AdminProductsClient from "@/components/AdminProductsClient";
import { getProducts } from "@/lib";
import { defaultProductRepository } from "@/server/productRepository";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts(defaultProductRepository());
  return <AdminProductsClient initialProducts={products} />;
}
