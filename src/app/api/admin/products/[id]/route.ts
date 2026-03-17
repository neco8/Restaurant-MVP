import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/server/productRepository";
import { price as toPrice } from "@/lib/price";
import { validateProductInput } from "@/lib/validateProduct";
import { requireSession } from "@/server/requireSession";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteParams) {
  const session = await requireSession(request);
  if (session instanceof Response) return session;

  const { id } = await context.params;
  const repository = defaultProductRepository();
  const product = await repository.findById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
  });
}

export async function PUT(request: Request, context: RouteParams) {
  const session = await requireSession(request);
  if (session instanceof Response) return session;

  const { id } = await context.params;
  const body = await request.json();
  const { name, description, price } = body;

  const validationError = validateProductInput({ name, price });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const repository = defaultProductRepository();
  const product = await repository.update(id, {
    name,
    description: description || "",
    price: toPrice(price),
  });

  return NextResponse.json({ id: product.id });
}

export async function DELETE(request: Request, context: RouteParams) {
  const session = await requireSession(request);
  if (session instanceof Response) return session;

  const { id } = await context.params;
  const repository = defaultProductRepository();
  await repository.delete(id);

  return NextResponse.json({ success: true });
}
