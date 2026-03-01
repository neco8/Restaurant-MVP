"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import RecentOrders from "@/components/RecentOrders";

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/orders?limit=5")
      .then((res) => res.json())
      .then((data: { orders: Order[]; totalCount: number }) => {
        setOrders(data.orders);
        setTotalCount(data.totalCount);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <AdminNav />
      <div className="mb-12 mt-8">
        <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
          Administration
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9]">Dashboard</h1>
      </div>
      <h2>最近の注文</h2>
      <RecentOrders orders={orders} totalCount={totalCount} />
    </div>
  );
}
