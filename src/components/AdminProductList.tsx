"use client";

import Link from "next/link";
import type { Product } from "@/lib";
import { formatPrice, ROUTES } from "@/lib";

type AdminProductListProps = {
  products: Product[];
  onDelete?: (id: string) => void;
};

export default function AdminProductList({ products, onDelete }: AdminProductListProps) {
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} data-testid="admin-product-row">
                <td>{product.name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <Link href={ROUTES.ADMIN_PRODUCTS_EDIT(product.id)}>
                    Edit {product.name}
                  </Link>
                  {onDelete && (
                    <button onClick={() => onDelete(product.id)}>
                      Delete {product.name}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
