import ProductDetail from "@/components/ProductDetail";
import { defaultProductRepository } from "@/server/productRepository";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const products = await defaultProductRepository().findAll();
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
