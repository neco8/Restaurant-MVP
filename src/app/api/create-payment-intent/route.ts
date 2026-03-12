import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/server/productRepository";
import { orderTotal } from "@/lib/totals";
import { parseQuantity } from "@/lib/quantity";
import { createStripeClient } from "@/server/stripeClient";
import { dollarsToCents } from "@/lib/currency";
import type { OrderLine, Product } from "@/lib/types";

type ValidateAndBuildOrderLinesResult =
  | { ok: true; orderLines: OrderLine[] }
  | { ok: false; error: string };

function validateAndBuildOrderLines(
  storedItems: { id: string; quantity: unknown }[],
  products: Product[]
): ValidateAndBuildOrderLinesResult {
  const orderLines = [];
  for (const storedItem of storedItems) {
    const product = products.find((candidate) => candidate.id === storedItem.id);
    if (!product) {
      return { ok: false, error: "Unknown product id" };
    }
    const qtyResult = parseQuantity(storedItem.quantity);
    if (qtyResult.isErr()) {
      return { ok: false, error: "Invalid quantity" };
    }
    orderLines.push({ price: product.price, quantity: qtyResult.value });
  }
  return { ok: true, orderLines };
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { cartItems: storedItems } = body;

  if (!Array.isArray(storedItems) || storedItems.length === 0) {
    return NextResponse.json({ error: "cartItems is required" }, { status: 400 });
  }

  const repo = defaultProductRepository();
  const products = await repo.findAll();

  const result = validateAndBuildOrderLines(storedItems, products);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { orderLines } = result;

  const amountInCents = dollarsToCents(orderTotal(orderLines));

  const stripe = createStripeClient();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    if (error instanceof Error && "rawType" in error) {
      if (error.rawType === "card_error") {
        return NextResponse.json({ error: error.message }, { status: 402 });
      }
      if (error.rawType === "rate_limit_error") {
        return NextResponse.json({ error: "Payment system is busy. Please try again in a moment." }, { status: 503 });
      }
    }
    return NextResponse.json({ error: "Payment could not be processed. Please try again later." }, { status: 500 });
  }
}
