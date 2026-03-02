import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";
import { fromCents, toCents } from "@/lib/cents";

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
  const { name, description, price } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const priceInCents = toCents(price);

  const product = await prisma.product.create({
    data: {
      name,
      description: description || "",
      price: priceInCents,
      image: "",
    },
  });

  return NextResponse.json({ id: product.id }, { status: 201 });
}
