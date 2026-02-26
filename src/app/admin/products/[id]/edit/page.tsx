"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import type { ProductFormData } from "@/components/ProductForm";
import { updateProductAction } from "../../actions";

export default function EditProductPage() {
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
    await updateProductAction(id, {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
    });
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
