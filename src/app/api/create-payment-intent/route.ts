import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/server/productRepository";
import { orderTotal } from "@/lib/totals";
import { parseQuantity } from "@/lib/quantity";
import { createStripeClient } from "@/server/stripeClient";

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

  const orderLines = [];
  for (const storedItem of storedItems) {
    const product = products.find((candidate) => candidate.id === storedItem.id);
    if (!product) {
      return NextResponse.json({ error: "Unknown product id" }, { status: 400 });
    }
    const qtyResult = parseQuantity(storedItem.quantity);
    if (qtyResult.isErr()) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    orderLines.push({ price: product.price, quantity: qtyResult.value });
  }

  const amountInCents = Math.round(orderTotal(orderLines) * 100);

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
