import Stripe from "stripe";
import { HttpsProxyAgent } from "https-proxy-agent";

export function createStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  const proxyUrl =
    process.env.GLOBAL_AGENT_HTTP_PROXY ||
    process.env.https_proxy ||
    process.env.HTTPS_PROXY;

  return new Stripe(secretKey, {
    ...(proxyUrl ? { httpAgent: new HttpsProxyAgent(proxyUrl) } : {}),
  });
}
