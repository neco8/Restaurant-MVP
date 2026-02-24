type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function ProductDetail({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: () => void;
}) {
  return (
    <>
      <h1>{product.name}</h1>
      <span data-testid="product-price">{product.price}</span>
      <span data-testid="product-description">{product.description}</span>
      <button onClick={onAddToCart}>Add to Cart</button>
      <span data-testid="cart-count">0</span>
    </>
  );
}
