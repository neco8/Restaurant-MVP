import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/lib/defaultProductRepository";

export async function GET() {
  const repo = defaultProductRepository();
  const products = await repo.findAll();
  return NextResponse.json(products);
}
