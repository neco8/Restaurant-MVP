"use client";

import ProductForm from "@/components/ProductForm";
import type { ProductFormData } from "@/components/ProductForm";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  async function handleSubmit(data: ProductFormData) {
    await createProductAction({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
    });
  }

  return (
    <div>
      <h1>Add Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
