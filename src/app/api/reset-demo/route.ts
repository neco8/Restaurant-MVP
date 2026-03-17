import { NextResponse } from "next/server";
import { resetDemo } from "@/lib/resetDemo";
import { defaultProductRepository } from "@/server/productRepository";

export const dynamic = "force-dynamic";

export async function POST() {
  await resetDemo({ productRepository: defaultProductRepository() });
  return NextResponse.json({ ok: true });
}
