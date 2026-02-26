"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import type { ProductFormData } from "@/components/ProductForm";
import { ROUTES } from "@/lib";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialValues, setInitialValues] = useState<ProductFormData | null>(null);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((product) => {
        setInitialValues({
          name: product.name,
          description: product.description,
          price: String(product.price),
        });
      });
  }, [id]);

  async function handleSubmit(data: ProductFormData) {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
      }),
    });

    if (response.ok) {
      router.push(ROUTES.ADMIN_PRODUCTS);
      router.refresh();
    }
  }

  if (!initialValues) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <ProductForm onSubmit={handleSubmit} initialValues={initialValues} />
    </div>
  );
}
