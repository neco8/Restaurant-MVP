"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import RecentOrders from "@/components/RecentOrders";
import { logout } from "@/app/admin/actions";

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders?limit=5")
      .then((res) => res.json())
      .then((data: { orders: Order[]; totalCount: number }) => {
        setOrders(data.orders);
        setTotalCount(data.totalCount);
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  }, []);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {
      setError("Something went wrong. Please try again.");
    });
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <AdminNav />
      <div className="mb-12 mt-8">
        <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
          Administration
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9]">Dashboard</h1>
      </div>
      <button onClick={() => logout()}>Log out</button>
      {error && <p role="alert">{error}</p>}
      <h2>Recent Orders</h2>
      <RecentOrders orders={orders} totalCount={totalCount} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
}
