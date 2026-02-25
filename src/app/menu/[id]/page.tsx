import ProductDetail from "@/components/ProductDetail";
import { defaultProductRepository } from "@/lib";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const products = await defaultProductRepository().findAll();
  const product = products.find((p) => p.id === params.id) ?? {
    id: params.id,
    name: "",
    price: 0,
    description: "",
  };
  return <ProductDetail product={product} />;
}
