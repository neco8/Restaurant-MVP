import { NextResponse } from "next/server";
import { createOrder } from "@/lib/createOrder";
import type { OrderItem } from "@/lib/types";
import { createPrismaOrderRepository } from "@/lib/prismaOrderRepository";
import { prisma } from "@/server/prismaClient";
import { centsToDollars, dollarsToCents } from "@/lib/currency";
import { price } from "@/lib/price";
import { quantity } from "@/lib/quantity";

export async function POST(request: Request) {
  const body = await request.json();

  const items: OrderItem[] = body.items.map(
    (item: { productId: string; quantity: number; price: number }) => ({
      productId: item.productId,
      quantity: quantity(item.quantity)._unsafeUnwrap(),
      price: price(centsToDollars(item.price)),
    })
  );

  const repository = createPrismaOrderRepository(prisma);
  const order = await createOrder(items, repository);

  return NextResponse.json(
    {
      id: order.id,
      status: order.status,
      total: dollarsToCents(order.total),
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: dollarsToCents(item.price),
      })),
    },
    { status: 201 }
  );
}
