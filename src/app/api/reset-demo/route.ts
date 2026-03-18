import { NextResponse } from "next/server";
import { resetDemo } from "@/lib/resetDemo";
import { defaultProductRepository } from "@/server/productRepository";
import { defaultOrderRepository } from "@/server/orderRepository";

export const dynamic = "force-dynamic";

export async function POST() {
  await resetDemo({
    productRepository: defaultProductRepository(),
    orderRepository: defaultOrderRepository(),
  });
  return NextResponse.json({ ok: true });
}
