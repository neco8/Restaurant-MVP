import { vi, it, expect, beforeEach } from "vitest";

const mockSendMail = vi.fn().mockResolvedValue({ messageId: "test-123" });

vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({ sendMail: mockSendMail }),
  },
}));

import { createNodemailerEmailSender } from "./nodemailerEmailSender";

beforeEach(() => {
  mockSendMail.mockClear();
  process.env.SMTP_HOST = "smtp.example.com";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = "user@example.com";
  process.env.SMTP_PASS = "password123";
  process.env.SMTP_FROM = "noreply@restaurant.com";
});

it("calls sendMail with correct to address", async () => {
  const sender = createNodemailerEmailSender();
  await sender.send({ to: "customer@example.com", subject: "Test", body: "Hello" });
  expect(mockSendMail).toHaveBeenCalledWith(
    expect.objectContaining({ to: "customer@example.com" })
  );
});

it("calls sendMail with correct subject", async () => {
  const sender = createNodemailerEmailSender();
  await sender.send({ to: "customer@example.com", subject: "Order Confirmation", body: "Hello" });
  expect(mockSendMail).toHaveBeenCalledWith(
    expect.objectContaining({ subject: "Order Confirmation" })
  );
});

it("calls sendMail with body as text", async () => {
  const sender = createNodemailerEmailSender();
  await sender.send({ to: "customer@example.com", subject: "Test", body: "Hello World" });
  expect(mockSendMail).toHaveBeenCalledWith(
    expect.objectContaining({ text: "Hello World" })
  );
});

it("uses SMTP_FROM as the from address", async () => {
  const sender = createNodemailerEmailSender();
  await sender.send({ to: "customer@example.com", subject: "Test", body: "Hello" });
  expect(mockSendMail).toHaveBeenCalledWith(
    expect.objectContaining({ from: "noreply@restaurant.com" })
  );
});
