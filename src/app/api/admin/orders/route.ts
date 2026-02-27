import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
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
  return NextResponse.json(orders);
}
