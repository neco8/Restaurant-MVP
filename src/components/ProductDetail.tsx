type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <h1>{product.name}</h1>
  );
}
