import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";
import { fromCents, toCents } from "@/lib/cents";
import { validateProduct } from "@/lib/validateProduct";

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
    price: fromCents(row.price),
  });
}

export async function PUT(request: Request, context: RouteParams) {
  const { id } = await context.params;
  const body = await request.json();
  const result = validateProduct(body);

  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { name, description, price } = result.data;
  const priceInCents = toCents(price);

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
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
