import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/server/productRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  const repo = defaultProductRepository();
  const products = await repo.findAll();
  return NextResponse.json(products);
}
