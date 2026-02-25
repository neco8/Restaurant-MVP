import ProductDetail from "@/components/ProductDetail";
import { defaultProductRepository, type Product } from "@/lib";

type Props = {
  params: { id: string };
  getProduct?: () => Promise<Product>;
};

export default async function ProductDetailPage({ params, getProduct }: Props) {
  const product = getProduct
    ? await getProduct()
    : (await defaultProductRepository().findAll()).find((p) => p.id === params.id) ??
      { id: params.id, name: "", price: 0, description: "" };
  return <ProductDetail product={product} />;
}
