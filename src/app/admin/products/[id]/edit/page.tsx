"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/lib";

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const routerRef = useRef(router);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceValue, setPriceValue] = useState("");

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setPriceValue(String(data.price));
      })
      .catch(() => {
        routerRef.current.push(ROUTES.ADMIN_PRODUCTS);
      });
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
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
      <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
        Administration
      </p>
      <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9] mb-16">
        Edit Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            htmlFor="name"
            className="block font-sans text-xs font-medium tracking-widest-2 uppercase text-muted mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border-b border-border bg-transparent px-0 py-3 font-serif text-lg focus:outline-none focus:border-accent transition-colors duration-200 dark:border-border"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block font-sans text-xs font-medium tracking-widest-2 uppercase text-muted mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-b border-border bg-transparent px-0 py-3 font-serif text-lg focus:outline-none focus:border-accent transition-colors duration-200 dark:border-border"
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block font-sans text-xs font-medium tracking-widest-2 uppercase text-muted mb-2"
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
            className="w-full border-b border-border bg-transparent px-0 py-3 font-serif text-lg focus:outline-none focus:border-accent transition-colors duration-200 dark:border-border"
          />
        </div>
        <button
          type="submit"
          className="font-sans text-xs font-medium tracking-widest-2 uppercase bg-foreground text-background px-10 py-4 hover:bg-accent transition-colors duration-300"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
