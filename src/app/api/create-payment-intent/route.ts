import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { amountInCents } = body;

  if (
    typeof amountInCents !== "number" ||
    !Number.isInteger(amountInCents) ||
    amountInCents <= 0
  ) {
    return NextResponse.json({ error: "Invalid amountInCents" }, { status: 400 });
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
