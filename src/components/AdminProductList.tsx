"use client";

import Link from "next/link";
import type { Product } from "@/lib";
import { formatPrice, ROUTES } from "@/lib";

export default function AdminProductList({ products }: { products: Product[] }) {
  return (
    <div>
      <h1>Products</h1>
      <Link href={ROUTES.ADMIN_PRODUCTS_NEW}>Add Product</Link>
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
