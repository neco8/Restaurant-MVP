import ProductDetail from "@/components/ProductDetail";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type Props = {
  params: { id: string };
  getProduct?: () => Promise<Product>;
};

export default async function ProductDetailPage({ params, getProduct }: Props) {
  const product = getProduct ? await getProduct() : { id: params.id, name: "", price: 0, description: "" };
  return <ProductDetail product={product} />;
}
