import Stripe from "stripe";
import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/lib/server/defaultProductRepository";
import { orderTotal } from "@/lib/totals";
import { parseQuantity } from "@/lib/quantity";

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
    const qty = parseQuantity(storedItem.quantity);
    if (qty === null) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    orderLines.push({ price: product.price, quantity: qty });
  }

  const amountInCents = Math.round(orderTotal(orderLines) * 100);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch {
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
