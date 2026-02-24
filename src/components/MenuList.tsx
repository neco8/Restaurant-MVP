"use client";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function MenuList({ products }: { products: Product[] }) {
  return (
    <>
      <h1>メニュー</h1>
      {products.map((product) => (
        <div key={product.id} data-testid="product-card">
          <span data-testid="product-name">{product.name}</span>
        </div>
      ))}
    </>
  );
}
