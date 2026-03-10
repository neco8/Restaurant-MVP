import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";
import { centsToDollars, dollarsToCents } from "@/lib/currency";
import { validateProductInput } from "@/lib/validateProduct";
import { getSession } from "@/server/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await prisma.product.findMany();
  const products = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: centsToDollars(row.price),
  }));
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, price } = body;

  const validationError = validateProductInput({ name, price });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const priceInCents = dollarsToCents(price);

  const product = await prisma.product.create({
    data: {
      name,
      description: description || "",
      price: priceInCents,
      image: body.image || "",
    },
  });

  return NextResponse.json({ id: product.id }, { status: 201 });
}
