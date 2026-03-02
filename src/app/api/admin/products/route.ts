import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";
import { fromCents, toCents } from "@/lib/cents";
import { validateProduct } from "@/lib/validateProduct";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.product.findMany();
  const products = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: fromCents(row.price),
  }));
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = validateProduct(body);

  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { name, description, price } = result.data;
  const priceInCents = toCents(price);

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: priceInCents,
      image: "",
    },
  });

  return NextResponse.json({ id: product.id }, { status: 201 });
}
