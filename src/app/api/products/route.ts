import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/lib/defaultProductRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  const repo = defaultProductRepository();
  const products = await repo.findAll();
  return NextResponse.json(products);
}
