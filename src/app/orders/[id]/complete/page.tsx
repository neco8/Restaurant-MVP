type Props = {
  params: { id: string };
};

export default async function OrderCompletePage({ params }: Props) {
  return (
    <div>
      <h1>Thank you for your order</h1>
      <p>Order ID: <span data-testid="order-id">{params.id}</span></p>
      <p data-testid="payment-status">Payment Complete</p>
    </div>
  );
}
