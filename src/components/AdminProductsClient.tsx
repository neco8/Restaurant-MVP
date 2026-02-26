"use client";

import AdminProductList from "./AdminProductList";
import type { Product } from "@/lib";
import { deleteProductAction } from "@/app/admin/products/actions";

export default function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  async function handleDelete(id: string) {
    await deleteProductAction(id);
  }

  return <AdminProductList products={initialProducts} onDelete={handleDelete} />;
}
