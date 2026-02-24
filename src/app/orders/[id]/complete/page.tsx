import Stripe from "stripe";

type Props = {
  params: { id: string };
};

export default async function OrderCompletePage({ params }: Props) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let status = "Payment Failed";
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
    <div>
      <h1>Thank you for your order</h1>
      <p>Order ID: <span data-testid="order-id">{params.id}</span></p>
      <p data-testid="payment-status">{status}</p>
    </div>
  );
}
