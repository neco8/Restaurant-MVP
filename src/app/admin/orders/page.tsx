"use client";

import { useEffect, useState } from "react";
import AdminOrderList from "@/components/AdminOrderList";
import AdminNav from "@/components/AdminNav";
import type { AdminOrder } from "@/components/AdminOrderList";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  async function handleStatusUpdate(orderId: string, newStatus: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <AdminNav />
      <div className="mb-12 mt-8">
        <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
          Administration
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9]">Orders</h1>
      </div>
      <AdminOrderList orders={orders} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
}
