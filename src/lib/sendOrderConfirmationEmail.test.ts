import { it, expect, vi } from "vitest";
import { sendOrderConfirmationEmail } from "./sendOrderConfirmationEmail";
import type { EmailSender } from "./types";

it("sends email with order confirmation subject", async () => {
  const mockSender: EmailSender = { send: vi.fn().mockResolvedValue(undefined) };
  await sendOrderConfirmationEmail({ to: "customer@example.com", orderId: "pi_test_123" }, mockSender);
  expect(mockSender.send).toHaveBeenCalledWith(
    expect.objectContaining({ subject: "Order Confirmation" })
  );
});

it("sends email to the provided address", async () => {
  const mockSender: EmailSender = { send: vi.fn().mockResolvedValue(undefined) };
  await sendOrderConfirmationEmail({ to: "customer@example.com", orderId: "pi_test_123" }, mockSender);
  expect(mockSender.send).toHaveBeenCalledWith(
    expect.objectContaining({ to: "customer@example.com" })
  );
});

it("includes order id in email body", async () => {
  const mockSender: EmailSender = { send: vi.fn().mockResolvedValue(undefined) };
  await sendOrderConfirmationEmail({ to: "customer@example.com", orderId: "pi_test_123" }, mockSender);
  expect(mockSender.send).toHaveBeenCalledWith(
    expect.objectContaining({ body: expect.stringContaining("pi_test_123") })
  );
});
