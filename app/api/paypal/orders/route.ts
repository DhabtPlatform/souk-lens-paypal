import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/paypal";

// POST { items, currency, invoiceId? } -> { ok, orderId, money, ... }
// Money math happens HERE (server-side) — the client never sends a total.
// Shipping mirrors the in-app invoice rule in lib/smart-market.ts:buildInvoice:
// free at ≥ 5000, else the per-line shipping cost (default 40).
const itemSchema = z.object({
  productId: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  variantKey: z.string().max(100).optional(),
  unitPrice: z.number().nonnegative().max(10_000_000),
  qty: z.number().int().min(1).max(999),
  shippingCost: z.number().nonnegative().max(100_000).optional(),
});
const bodySchema = z.object({
  items: z.array(itemSchema).min(1).max(50),
  currency: z.string().min(2).max(6),
  invoiceId: z.string().max(64).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid order payload", detail: parsed.error.issues[0]?.message }, { status: 400 });
    }
    const { items, currency, invoiceId } = parsed.data;
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const shipping = subtotal >= 5000 ? 0 : items.reduce((s, i) => s + (i.shippingCost ?? 40), 0);
    const order = await createOrder(
      items.map((i) => ({ name: i.name, unitPrice: i.unitPrice, qty: i.qty })),
      shipping,
      currency,
      invoiceId ?? `SL-${Date.now().toString(36).toUpperCase()}`
    );
    return NextResponse.json({ ok: true, ...order });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e instanceof Error ? e.message : e) }, { status: 502 });
  }
}
