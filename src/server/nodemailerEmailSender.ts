import nodemailer from "nodemailer";
import type { EmailSender } from "@/lib/types";

export function createNodemailerEmailSender(): EmailSender {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return {
    async send({ to, subject, body }) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text: body,
      });
    },
  };
}
