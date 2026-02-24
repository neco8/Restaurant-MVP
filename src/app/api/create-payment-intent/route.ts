import Stripe from "stripe";
import { NextResponse } from "next/server";
import { defaultProductRepository } from "@/lib/defaultProductRepository";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { cartItems } = body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return NextResponse.json({ error: "cartItems is required" }, { status: 400 });
  }

  const repo = defaultProductRepository();
  const products = await repo.findAll();

  let amountInCents = 0;
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      return NextResponse.json({ error: "Unknown product id" }, { status: 400 });
    }
    amountInCents += Math.round(product.price * 100) * item.quantity;
  }

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
