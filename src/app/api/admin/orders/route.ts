import { NextResponse } from "next/server";
import { defaultOrderRepository } from "@/server/orderRepository";
import { requireSession } from "@/server/requireSession";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await requireSession(request);
  if (session instanceof Response) return session;

  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  const repository = defaultOrderRepository();

  const rows = await repository.findAll(limit ? { limit } : undefined);

  const orders = rows.map((row) => ({
    id: row.id,
    status: row.status,
    total: Number(row.total),
    createdAt: row.createdAt.toISOString(),
    items: row.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      quantity: Number(item.quantity),
      price: Number(item.price),
    })),
  }));

  const totalCount = await repository.count();
  return NextResponse.json({ orders, totalCount });
}
