import { NextResponse } from "next/server";
import { isSupportedCurrency, paypalClientId, paypalConfigured, paypalEnv } from "@/lib/paypal";

// Public runtime config for the checkout UI. The client id is public by design
// (it is what the PayPal JS SDK loads with); the secret never leaves the server.
export async function GET() {
  const configured = paypalConfigured();
  return NextResponse.json({
    ok: true,
    configured,
    env: paypalEnv(),
    clientId: configured ? paypalClientId() : null,
    currency: process.env.PAYPAL_CURRENCY ?? "USD",
    fxRate: Number(process.env.PAYPAL_FX_RATE ?? "50"),
    supportsEgp: isSupportedCurrency("EGP"),
  });
}
