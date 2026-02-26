import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteParams) {
  const { id } = await context.params;
  const row = await prisma.product.findUnique({ where: { id } });

  if (!row) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price / 100,
  });
}

export async function PUT(request: Request, context: RouteParams) {
  const { id } = await context.params;
  const body = await request.json();
  const { name, description, price } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const priceInCents = Math.round(price * 100);

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description: description || "",
      price: priceInCents,
      image: "",
    },
  });

  return NextResponse.json({ id: product.id });
}

export async function DELETE(_request: Request, context: RouteParams) {
  const { id } = await context.params;

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
