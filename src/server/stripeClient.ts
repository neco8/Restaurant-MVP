import Stripe from "stripe";
import { HttpsProxyAgent } from "https-proxy-agent";

export function createStripeClient(): Stripe {
  const proxyUrl =
    process.env.GLOBAL_AGENT_HTTP_PROXY ||
    process.env.https_proxy ||
    process.env.HTTPS_PROXY;

  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    ...(proxyUrl ? { httpAgent: new HttpsProxyAgent(proxyUrl) } : {}),
  });
}
