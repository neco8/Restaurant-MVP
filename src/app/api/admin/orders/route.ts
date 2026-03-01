import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";

export const dynamic = "force-dynamic";

export async function GET(request?: Request) {
  const url = request ? new URL(request.url) : null;
  const limitParam = url?.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  const rows = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    ...(limit !== null ? { take: limit } : {}),
  });

  const orders = rows.map((row) => ({
    id: row.id,
    status: row.status,
    total: row.total / 100,
    createdAt: row.createdAt.toISOString(),
    items: row.items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price / 100,
    })),
  }));

  if (limit !== null) {
    const totalCount = await prisma.order.count();
    return NextResponse.json({ orders, totalCount });
  }

  return NextResponse.json(orders);
}
