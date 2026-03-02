"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib";
import { ROUTES } from "@/lib";
import AdminProductList from "@/components/AdminProductList";
import AdminNav from "@/components/AdminNav";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <AdminNav />
      <div className="flex items-center justify-between mb-12 mt-8">
        <div>
          <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
            Administration
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9]">Products</h1>
        </div>
        <Link
          href={ROUTES.ADMIN_PRODUCTS_NEW}
          className="font-sans text-xs font-medium tracking-widest-2 uppercase bg-foreground text-background px-8 py-3 hover:bg-accent transition-colors duration-300"
        >
          Add Product
        </Link>
      </div>
      {error && <p role="alert">{error}</p>}
      <AdminProductList products={products} onDelete={handleDelete} />
    </div>
  );
}
