import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";
import { centsToDollars } from "@/lib/currency";
import { getSession } from "@/server/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  const rows = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    ...(limit !== null ? { take: limit } : {}),
  });

  const orders = rows.map((row) => ({
    id: row.id,
    status: row.status,
    total: centsToDollars(row.total),
    createdAt: row.createdAt.toISOString(),
    items: row.items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: centsToDollars(item.price),
    })),
  }));

  const totalCount = await prisma.order.count();
  return NextResponse.json({ orders, totalCount });
}
