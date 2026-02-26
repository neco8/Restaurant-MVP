"use client";

import type { Product } from "@/lib";
import { formatPrice } from "@/lib";

export default function AdminProductList({ products }: { products: Product[] }) {
  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} data-testid="admin-product-row">
                <td>{product.name}</td>
                <td>{formatPrice(product.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
