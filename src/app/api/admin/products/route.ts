import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/server/productRepository";
import { addProduct } from "@/lib/addProduct";
import { parsePrice } from "@/lib/price";

export const dynamic = "force-dynamic";

export async function GET() {
  const repo = defaultProductRepository();
  const products = await repo.findAll();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, price: rawPrice } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const parsedPrice = parsePrice(rawPrice);
  if (parsedPrice === null) {
    return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
  }

  const repo = defaultProductRepository();
  const product = await addProduct(repo, {
    name,
    description: description || "",
    price: parsedPrice,
  });

  return NextResponse.json(product, { status: 201 });
}
