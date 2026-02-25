import Stripe from "stripe";

type Props = {
  params: { id: string };
};

export default async function OrderCompletePage({ params }: Props) {
  let status = "Payment Failed";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
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
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-6">Thank you for your order</h1>
      <p className="text-stone-600 mb-2 dark:text-stone-400">
        Order ID: <span data-testid="order-id" className="font-mono">{params.id}</span>
      </p>
      <p data-testid="payment-status" className="text-lg font-semibold">{status}</p>
    </div>
  );
}
