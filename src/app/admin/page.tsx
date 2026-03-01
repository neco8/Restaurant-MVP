import AdminNav from "@/components/AdminNav";
import RecentOrders from "@/components/RecentOrders";

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
      <h2>最近の注文</h2>
      <RecentOrders orders={[]} />
    </div>
  );
}
