import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { amountInCents } = await request.json();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
}
