"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export type PayItem = {
  productId: string;
  name: string;
  variantKey?: string;
  unitPrice: number;
  qty: number;
  shippingCost?: number;
};

type PayConfig = {
  ok: boolean;
  configured: boolean;
  env: string;
  clientId: string | null;
  currency: string;
  fxRate: number;
};

type W = Window & {
  paypal?: {
    Buttons: (opts: Record<string, unknown>) => { render: (el: HTMLElement) => Promise<void>; close?: () => void };
  };
};

// Shape of the order resource returned by the SDK's actions.order.capture().
type CaptureResource = {
  id?: string;
  status?: string;
  purchase_units?: { payments?: { captures?: { id?: string; amount?: { value?: string; currency_code?: string } }[] } }[];
};

// One shared loader so several button blocks on a page load the SDK once.
let sdkPromise: Promise<boolean> | null = null;
function loadSdk(clientId: string, currency: string): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const w = window as W;
  if (w.paypal?.Buttons) return Promise.resolve(true);
  sdkPromise ??= new Promise<boolean>((resolve) => {
    const s = document.createElement("script");
    const params = new URLSearchParams({
      "client-id": clientId,
      currency,
      intent: "capture",
      components: "buttons",
      "disable-funding": "credit",
    });
    s.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => {
      sdkPromise = null;
      resolve(false);
    };
    document.head.appendChild(s);
  });
  return sdkPromise;
}

// Real PayPal Smart Payment Buttons over the Orders API (create → approve → capture).
// When the sandbox credentials are absent the block renders an honest notice
// instead of pretending to pay.
export function PaypalButtons({
  items, shipping, currency, totalLabel, lang, invoiceId, onCompleted,
}: {
  items: PayItem[];
  shipping: number;
  currency: string;
  totalLabel: string;
  lang: "ar" | "en";
  invoiceId?: string;
  onCompleted?: (capture: { status: string; captureId: string | null; amount: string | null; currency: string | null }) => void;
}) {
  const ar = lang === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const itemsKey = JSON.stringify(items);
  const [cfg, setCfg] = useState<PayConfig | null>(null);
  const [rendered, setRendered] = useState(false);
  const [failed, setFailed] = useState("");

  useEffect(() => {
    let dead = false;
    fetch("/api/paypal/config")
      .then((r) => r.json())
      .then((c: PayConfig) => { if (!dead) setCfg(c); })
      .catch(() => { if (!dead) setCfg({ ok: false, configured: false, env: "sandbox", clientId: null, currency: "USD", fxRate: 50 }); });
    return () => { dead = true; };
  }, []);

  useEffect(() => {
    if (!cfg?.configured || !cfg.clientId) return;
    let dead = false;
    let buttons: { render: (el: HTMLElement) => Promise<void>; close?: () => void } | null = null;
    loadSdk(cfg.clientId, cfg.currency).then((ok) => {
      if (dead || !ok || !ref.current) return;
      const pp = (window as W).paypal;
      if (!pp?.Buttons) return;
      buttons = pp.Buttons({
        style: { layout: "vertical", shape: "pill", color: "gold", height: 46 },
        createOrder: async () => {
          const r = await fetch("/api/paypal/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: JSON.parse(itemsKey) as PayItem[], currency, invoiceId }),
          });
          const j = (await r.json()) as { ok: boolean; orderId?: string; error?: string; currencyCode?: string; converted?: boolean; fxRate?: number; total?: number };
          if (!j.ok || !j.orderId) throw new Error(j.error ?? "create order failed");
          if (j.converted) {
            toast.info(ar ? `هيتحصّل ${j.currencyCode} ${j.total} (سعر تحويل معلن ${j.fxRate})` : `Charged as ${j.currencyCode} ${j.total} (labeled conversion rate ${j.fxRate})`);
          }
          return j.orderId;
        },
        onApprove: async (_data: unknown, actions: { order?: { capture?: () => Promise<CaptureResource> } }) => {
          // Capture in the buyer's browser via PayPal's standard SDK helper —
          // the approval token lives inside the PayPal popup session, so the
          // app never needs to route an order id through its own server.
          const details = (await actions.order?.capture?.()) ?? {};
          const cap = details.purchase_units?.[0]?.payments?.captures?.[0];
          onCompleted?.({
            status: details.status ?? "COMPLETED",
            captureId: cap?.id ?? details.id ?? null,
            amount: cap?.amount?.value ?? null,
            currency: cap?.amount?.currency_code ?? null,
          });
        },
        onError: (err: unknown) => {
          setFailed(err instanceof Error ? err.message : String(err));
          toast.error(ar ? "فشل دفع بايبال — جرّب تاني" : "PayPal payment failed — try again");
        },
      });
      buttons.render(ref.current!).then(() => { if (!dead) setRendered(true); }).catch(() => {});
    });
    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg, itemsKey]);

  const sourceSum = items.reduce((s, i) => s + i.unitPrice * i.qty, 0) + Math.max(0, shipping);
  const rate = cfg?.fxRate ?? 50;
  const needsConversion = cfg?.currency && currency.toUpperCase() !== cfg.currency.toUpperCase();
  if (!cfg) {
    return <div className="h-[52px] animate-pulse rounded-xl bg-muted" />;
  }

  if (!cfg.configured) {
    return (
      <div className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/40 p-3 text-center text-xs leading-6 text-muted-foreground">
        <span className="font-black text-foreground">PayPal checkout is wired end-to-end</span> — Orders API create → approve → capture.
        {ar
          ? " ضيف PAYPAL_CLIENT_ID و PAYPAL_CLIENT_SECRET في .env لتشغيل أزرار بايبال الحقيقية هنا."
          : " Add PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET to .env to enable the live sandbox buttons here."}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {needsConversion && (
        <p className="text-center text-xs font-bold text-muted-foreground">
          {ar
            ? `المطلوب ${totalLabel} ← يتحصّل ${cfg.currency} ${(sourceSum / rate).toFixed(2)} — سعر تحويل معلن وثابت (${rate} ${currency}/${cfg.currency})`
            : `${totalLabel} → charged as ${cfg.currency} ${(sourceSum / rate).toFixed(2)} — labeled fixed conversion (${rate} ${currency}/${cfg.currency})`}
        </p>
      )}
      <div ref={ref} className="min-h-[52px]" />
      {failed && <p className="text-center text-xs font-bold text-destructive">{failed}</p>}
      {rendered && (
        <p className="text-center text-[11px] text-muted-foreground">
          {ar ? "دفع آمن داخل نافذة بايبال — بياناتك لا تلمس المنصة أبداً" : "Secure payment inside PayPal's popup — your credentials never touch this app"}
        </p>
      )}
      <Badge variant="outline" className="mx-auto block w-fit">{`PayPal ${cfg.env}`}</Badge>
    </div>
  );
}
