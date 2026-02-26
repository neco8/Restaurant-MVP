"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib";
import { ROUTES } from "@/lib";
import AdminProductList from "@/components/AdminProductList";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Products</h1>
        <Link
          href={ROUTES.ADMIN_PRODUCTS_NEW}
          className="rounded-lg bg-amber-600 px-4 py-2 text-white font-semibold hover:bg-amber-700 transition-colors"
        >
          Add Product
        </Link>
      </div>
      <AdminProductList products={products} onDelete={handleDelete} />
    </div>
  );
}
