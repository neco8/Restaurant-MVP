"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/lib";

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceValue, setPriceValue] = useState("");

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setPriceValue(String(data.price));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(priceValue),
      }),
    });

    if (res.ok) {
      router.push(ROUTES.ADMIN_PRODUCTS);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">
        Edit Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-800"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-800"
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium mb-1"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-800"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-amber-600 px-6 py-2 text-white font-semibold hover:bg-amber-700 transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
