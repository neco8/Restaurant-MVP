import type { EmailSender } from "./types";

export async function sendOrderConfirmationEmail(
  options: { to: string; orderId: string },
  sender: EmailSender,
): Promise<void> {
  await sender.send({
    to: options.to,
    subject: "Order Confirmation",
    body: `Thank you for your order!\n\nYour order ID is: ${options.orderId}`,
  });
}
