"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import type { ProductFormData } from "@/components/ProductForm";
import { ROUTES } from "@/lib";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(data: ProductFormData) {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
      }),
    });

    if (response.ok) {
      router.push(ROUTES.ADMIN_PRODUCTS);
    }
  }

  return (
    <div>
      <h1>Add Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
