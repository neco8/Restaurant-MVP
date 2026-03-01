import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

const VALID_STATUSES = ["pending", "preparing", "done"];

export async function PUT(request: Request, context: RouteParams) {
  const { id } = await context.params;
  const body = await request.json();
  const { status } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ id: order.id, status: order.status });
}
