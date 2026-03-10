import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";
import { requireSession } from "@/server/requireSession";
import {
  validateStatusTransition,
  type OrderStatus,
} from "@/lib/orderStatus";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

const VALID_STATUSES = ["pending", "preparing", "done"];

export async function PUT(request: Request, context: RouteParams) {
  const session = await requireSession(request);
  if (session instanceof Response) return session;

  const { id } = await context.params;
  const body = await request.json();
  const { status } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const currentOrder = await prisma.order.findUnique({ where: { id } });

  if (!currentOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const transitionResult = validateStatusTransition(
    currentOrder.status as OrderStatus,
    status as OrderStatus,
  );

  if (transitionResult.isErr()) {
    return NextResponse.json(
      { error: transitionResult.error },
      { status: 400 },
    );
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ id: order.id, status: order.status });
}
