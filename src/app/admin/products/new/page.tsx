"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceValue, setPriceValue] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/products", {
      method: "POST",
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
        New Product
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
          Create Product
        </button>
      </form>
    </div>
  );
}
