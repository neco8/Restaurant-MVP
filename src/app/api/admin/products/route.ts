import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/server/productRepository";
import { price as toPrice } from "@/lib/price";
import { validateProductInput } from "@/lib/validateProduct";
import { requireSession } from "@/server/requireSession";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await requireSession(request);
  if (session instanceof Response) return session;

  const repository = defaultProductRepository();
  const products = await repository.findAll();
  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
    }))
  );
}

export async function POST(request: Request) {
  const session = await requireSession(request);
  if (session instanceof Response) return session;

  const body = await request.json();
  const { name, description, price } = body;

  const validationError = validateProductInput({ name, price });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const repository = defaultProductRepository();
  const product = await repository.create({
    name,
    description: description || "",
    price: toPrice(price),
  });

  return NextResponse.json({ id: product.id }, { status: 201 });
}
