"use client";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PaypalButtons } from "@/components/paypal/paypal-buttons";
import { HowItWorks } from "@/components/products/how-it-works";
import type { CartItem } from "@/hooks/use-cart";
import { buildInvoice } from "@/lib/smart-market";
import { formatPrice } from "@/lib/utils";
import { CheckCheck, Minus, Plus, ShieldCheck, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CartSheet({
  open, onOpenChange, items, lang, setQty, remove, clear, onCheckout,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  items: CartItem[]; lang: "ar" | "en";
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void; clear: () => void;
  onCheckout?: (items: CartItem[]) => void;
}) {
  const ar = lang === "ar";
  const [orderNo, setOrderNo] = useState("");
  const [capture, setCapture] = useState<{ captureId: string | null; amount: string | null; currency: string | null } | null>(null);
  // Stable per session — sent as the PayPal reference_id on every checkout.
  const invoiceRef = useRef(`SL-${Date.now().toString(36).toUpperCase()}`).current;
  const totals = buildInvoice(items.map((i) => ({ price: i.product.price, compareAtPrice: i.product.compareAtPrice, shippingCost: i.product.shippingCost, deliveryDays: i.product.deliveryDays, qty: i.qty })));
  const currency = items[0]?.product.currency ?? "EGP";

  function checkout() {
    setCapture(null);
    setOrderNo(`SL-ORD-${Date.now().toString().slice(-6)}`);
    onCheckout?.(items);
    toast.success(ar ? "اتسجل الطلب في مبيعات البائع (بدون دفع — ديمو)" : "Order recorded in seller sales (no payment — demo)");
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setOrderNo(""); setCapture(null); } }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl"><ShoppingCart className="text-primary" />{ar ? "سلة الدفع" : "Checkout cart"}</SheetTitle>
          <SheetDescription>{ar ? "منتجات بكل تفاصيلها من السوق الذكي أو نتائج البحث — عدّل الكمية وادفع." : "Full-detail products from Smart Market or search — adjust qty and pay."}</SheetDescription>
          <div className="px-5 pt-3"><HowItWorks lang={lang} steps={ar ? ["المنتجات بتوصل هنا من زر السلة على أي كارت، أو دفعة واحدة من قايمة معتمدة في السوق الذكي.", "زود الكمية أو نقصها بالزرارين، أو احذف منتجًا — الإجمالي والشحن والتوفير بيتحسبوا تلقائيًا.", "ادفع بأزرار بايبال الحقيقية (Sandbox) عبر Orders API: إنشاء ← موافقة ← تحصيل — والمبيعات تتسجل من الأوردرات المتأكدة فقط. زر «تسجيل بدون دفع» ديمو معلن."] : ["Items land here from the cart button on any card, or all at once from an approved Smart Market list.", "Raise or lower qty with the buttons, or remove an item — total, shipping and savings recalculate automatically.", "Pay with real PayPal sandbox buttons via the Orders API: create → approve → capture. Seller sales record confirmed orders only — the no-payment button is a labeled demo."]} /></div>
        </SheetHeader>

        <div className="space-y-4 p-5">
          {orderNo ? (
            <div className="space-y-3 rounded-2xl border border-accent/50 bg-accent/10 p-5 text-center animate-souk-in">
              <CheckCheck className="mx-auto h-10 w-10 text-accent" />
              <h3 className="text-xl font-black">{capture ? (ar ? "تم الدفع ببايبال" : "Paid with PayPal") : (ar ? "تم تسجيل الطلب (ديمو)" : "Order recorded (demo)")}</h3>
              <Badge variant="accent">{orderNo}</Badge>
              {capture ? (
                <p className="text-sm leading-7 text-muted-foreground">
                  {ar
                    ? `تحصيل بايبال ناجح (Sandbox): ${capture.amount ?? "—"} ${capture.currency ?? ""} — الطلب اتسجل في مبيعات البائع والمخزون اتخصم.`
                    : `PayPal capture completed (sandbox): ${capture.amount ?? "—"} ${capture.currency ?? ""} — order recorded in seller sales and stock decremented.`}
                </p>
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">{ar ? "تسجيل بدون دفع للعرض فقط — الدفع الحقيقي بأزرار بايبال فوق." : "Recorded without payment for the demo — real payment is the PayPal buttons above."}</p>
              )}
              <Button variant="outline" onClick={() => { clear(); setOrderNo(""); setCapture(null); onOpenChange(false); }}>{ar ? "ابدأ طلب جديد" : "New order"}</Button>
            </div>
          ) : items.length ? (
            <>
              <div className="space-y-2.5">
                {items.map(({ product: p, qty }) => (
                  <div key={p.id} className="flex gap-3 rounded-xl border bg-card p-3 animate-souk-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0] ?? "/brand/empty-stall.jpg"} alt={p.name_en} className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold">{ar ? p.name_ar : p.name_en}</p>
                      <p className="text-xs text-muted-foreground">{p.sellerName ?? p.brand} · {p.sku}</p>
                      <p className="mt-1 text-sm font-black text-accent">{formatPrice(p.price * qty, p.currency)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setQty(p.id, qty - 1)} aria-label="minus"><Minus /></Button>
                        <span className="min-w-6 text-center font-black">{qty}</span>
                        <Button size="sm" variant="outline" onClick={() => setQty(p.id, qty + 1)} aria-label="plus"><Plus /></Button>
                        <Button size="sm" variant="ghost" className="ms-auto" onClick={() => remove(p.id)} aria-label="remove"><Trash2 className="text-destructive" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm leading-8">
                <Row label={ar ? "المجموع الفرعي" : "Subtotal"} value={formatPrice(totals.subtotal, currency)} />
                <Row label={ar ? "توفير الخصومات" : "Savings"} value={`-${formatPrice(totals.savings, currency)}`} accent />
                <Row label={ar ? "الشحن" : "Shipping"} value={totals.shipping === 0 ? (ar ? "مجاني" : "Free") : formatPrice(totals.shipping, currency)} />
                <Row label={ar ? "التوصيل خلال" : "Delivery within"} value={`${totals.maxDeliveryDays} ${ar ? "يوم" : "days"}`} />
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-black"><span>{ar ? "الإجمالي" : "Total"}</span><span className="text-accent">{formatPrice(totals.total, currency)}</span></div>
              <PaypalButtons
                items={items.map(({ product: p, qty }) => ({ productId: p.id, name: ar ? p.name_ar : p.name_en, unitPrice: p.price, qty, shippingCost: p.shippingCost }))}
                shipping={totals.shipping}
                currency={currency}
                totalLabel={formatPrice(totals.total, currency)}
                lang={lang}
                invoiceId={invoiceRef}
                onCompleted={(cap) => {
                  setCapture(cap);
                  setOrderNo(cap.captureId ?? `SL-PP-${Date.now().toString().slice(-6)}`);
                  onCheckout?.(items);
                  toast.success(ar ? "اتأكد الدفع ببايبال — الطلب اتسجل في مبيعات البائع" : "Paid with PayPal — order recorded in seller sales");
                }}
              />
              <Button size="lg" variant="outline" className="w-full" onClick={checkout}><ShieldCheck />{ar ? "تسجيل الطلب بدون دفع (ديمو معلن)" : "Record order without payment (labeled demo)"}</Button>
              <Button variant="ghost" className="w-full" onClick={clear}>{ar ? "إفراغ السلة" : "Clear cart"}</Button>
            </>
          ) : (
            <div className="py-8 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/empty-stall.jpg" alt="" className="mx-auto w-40 rounded-3xl" />
              <p className="mt-3 font-extrabold">{ar ? "السلة فاضية" : "Cart is empty"}</p>
              <p className="text-sm leading-7 text-muted-foreground">{ar ? "اعتمد قايمة من السوق الذكي وضيفها هنا للدفع." : "Approve a Smart Market list and add it here."}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><strong className={accent ? "text-accent" : ""}>{value}</strong></div>;
}
