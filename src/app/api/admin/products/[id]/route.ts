import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";
import { centsToDollars, dollarsToCents } from "@/lib/currency";
import { validateProductInput } from "@/lib/validateProduct";
import { getSession } from "@/server/session";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteParams) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const row = await prisma.product.findUnique({ where: { id } });

  if (!row) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: row.id,
    name: row.name,
    description: row.description,
    price: centsToDollars(row.price),
  });
}

export async function PUT(request: Request, context: RouteParams) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const { name, description, price } = body;

  const validationError = validateProductInput({ name, price });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const priceInCents = dollarsToCents(price);

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description: description || "",
      price: priceInCents,
    },
  });

  return NextResponse.json({ id: product.id });
}

export async function DELETE(request: Request, context: RouteParams) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
