import { createStripeClient } from "@/server/stripeClient";

type Props = {
  params: { id: string };
  searchParams?: { email?: string };
};

export default async function OrderCompletePage({ params }: Props) {
  let status = "Payment Failed";

  const stripe = createStripeClient();
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(params.id);
    switch (paymentIntent.status) {
      case "succeeded":
        status = "Payment Complete";
        break;
      case "processing":
        status = "Payment Processing";
        break;
      case "canceled":
      case "requires_payment_method":
      case "requires_confirmation":
      case "requires_action":
      case "requires_capture":
        status = "Payment Failed";
        break;
    }
  } catch {
    // Payment intent not found or other error
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Thank you for your order</h1>
      <p className="text-stone-400 mb-3 dark:text-stone-500">
        Order ID: <span data-testid="order-id" className="font-mono text-stone-600 dark:text-stone-300">{params.id}</span>
      </p>
      <p data-testid="payment-status" className="text-xl font-bold text-amber-700 dark:text-amber-400">{status}</p>
    </div>
  );
}
