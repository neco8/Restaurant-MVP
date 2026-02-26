"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProductList from "./AdminProductList";
import type { Product } from "@/lib";

export default function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  async function handleDelete(id: string) {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setProducts(products.filter((p) => p.id !== id));
      router.refresh();
    }
  }

  return <AdminProductList products={products} onDelete={handleDelete} />;
}
