"use client";

import Link from "next/link";
import type { Product } from "@/lib";
import { formatPrice, ROUTES } from "@/lib";

type Props = {
  products: Product[];
  onDelete: (id: string) => void;
};

export default function AdminProductList({ products, onDelete }: Props) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-stone-200 dark:border-stone-700">
          <th className="text-left py-3 px-4">Name</th>
          <th className="text-left py-3 px-4">Price</th>
          <th className="text-left py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product.id}
            className="border-b border-stone-100 dark:border-stone-800"
          >
            <td className="py-3 px-4">{product.name}</td>
            <td className="py-3 px-4">{formatPrice(product.price)}</td>
            <td className="py-3 px-4 space-x-2">
              <Link
                href={ROUTES.ADMIN_PRODUCTS_EDIT(product.id)}
                className="text-amber-700 hover:underline dark:text-amber-400"
              >
                Edit {product.name}
              </Link>
              <button
                onClick={() => onDelete(product.id)}
                className="text-red-600 hover:underline dark:text-red-400"
              >
                Delete {product.name}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
