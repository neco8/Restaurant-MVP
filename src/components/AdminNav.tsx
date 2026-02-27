import Link from "next/link";
import { ROUTES } from "@/lib";

export default function AdminNav() {
  return (
    <nav className="flex gap-6">
      <Link
        href={ROUTES.ADMIN_PRODUCTS}
        className="font-sans text-xs font-medium tracking-widest-2 uppercase text-muted hover:text-foreground transition-colors duration-200"
      >
        Products
      </Link>
      <Link
        href={ROUTES.ADMIN_ORDERS}
        className="font-sans text-xs font-medium tracking-widest-2 uppercase text-muted hover:text-foreground transition-colors duration-200"
      >
        Orders
      </Link>
    </nav>
  );
}
