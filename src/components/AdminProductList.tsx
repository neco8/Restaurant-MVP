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
    return <p className="font-serif text-base font-light italic text-muted">No products found.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-foreground">
          <th className="text-left py-3 px-4 font-sans text-xs font-medium tracking-widest-2 uppercase text-muted">Name</th>
          <th className="text-left py-3 px-4 font-sans text-xs font-medium tracking-widest-2 uppercase text-muted">Price</th>
          <th className="text-left py-3 px-4 font-sans text-xs font-medium tracking-widest-2 uppercase text-muted">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product.id}
            className="border-b border-border hover:bg-surface-hover transition-colors duration-200"
          >
            <td className="py-4 px-4 font-serif text-lg font-normal">{product.name}</td>
            <td className="py-4 px-4 font-sans text-sm text-muted tabular-nums">{formatPrice(product.price)}</td>
            <td className="py-4 px-4 space-x-4">
              <Link
                href={ROUTES.ADMIN_PRODUCTS_EDIT(product.id)}
                className="font-sans text-xs tracking-wider uppercase text-accent hover:text-foreground transition-colors duration-200"
              >
                Edit {product.name}
              </Link>
              <button
                onClick={() => onDelete(product.id)}
                className="font-sans text-xs tracking-wider uppercase text-red-700 hover:text-red-500 transition-colors duration-200 dark:text-red-400 dark:hover:text-red-300"
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
