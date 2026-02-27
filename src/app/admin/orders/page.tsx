"use client";

import { useEffect, useState } from "react";
import AdminOrderList from "@/components/AdminOrderList";
import type { AdminOrder } from "@/components/AdminOrderList";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <div className="mb-12">
        <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
          Administration
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9]">Orders</h1>
      </div>
      <AdminOrderList orders={orders} />
    </div>
  );
}
