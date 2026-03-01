"use client";

import AdminNav from "@/components/AdminNav";
import { logout } from "@/app/admin/actions";

export default function AdminDashboardPage() {
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
    </div>
  );
}
