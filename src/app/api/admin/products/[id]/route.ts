import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/server/productRepository";
import { updateProduct } from "@/lib/updateProduct";
import { parsePrice } from "@/lib/price";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const repo = defaultProductRepository();
  const product = await repo.findById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const body = await request.json();
  const input: Record<string, unknown> = {};

  if (body.name !== undefined) input.name = body.name;
  if (body.description !== undefined) input.description = body.description;
  if (body.price !== undefined) {
    const parsedPrice = parsePrice(body.price);
    if (parsedPrice === null) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    input.price = parsedPrice;
  }

  const repo = defaultProductRepository();
  const product = await updateProduct(repo, params.id, input);
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const repo = defaultProductRepository();
  await repo.delete(params.id);
  return new NextResponse(null, { status: 204 });
}
