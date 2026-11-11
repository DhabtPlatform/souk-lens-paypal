// PayPal brand marks as inline SVG/text — no external assets, crisp at any size.
// Monogram: two overlapping "P" glyphs in PayPal's official blues (#003087 dark,
// #009CDE light). Used on light pill backgrounds so the blues keep contrast on
// the dark theme.

export function PaypalMonogram({ size = 20 }: { size?: number }) {
  // One "P" path (with counter hole); drawn twice, offset, two blues.
  const P =
    "M8 28 L12.6 28 L14 19 L17.2 19 C22.6 19 26.2 15.8 27 11.4 C27.8 7 24.9 4.2 19.6 4.2 L9.4 4.2 Z " +
    "M13.6 8.2 L18.6 8.2 C20.9 8.2 22 9.3 21.7 11.2 C21.4 13.3 19.8 14.4 17.4 14.4 L14.7 14.4 Z";
  return (
    <svg width={size} height={Math.round((size * 30) / 33)} viewBox="0 0 33 30" aria-hidden="true" focusable="false">
      <path d={P} fill="#009CDE" transform="translate(4.5,-2.5)" fillRule="evenodd" />
      <path d={P} fill="#003087" fillRule="evenodd" />
    </svg>
  );
}

export function PaypalWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block font-extrabold italic tracking-tight leading-none ${className}`}
      style={{ color: "#003087", letterSpacing: "-0.04em" }}
    >
      PayPal
    </span>
  );
}

// White pill for the dark header/hero: monogram + wordmark + sandbox dot.
// The shimmer sweep (globals.css .paypal-chip::after) is the "judge sparkle".
export function PaypalChip({ lang, label }: { lang: "ar" | "en"; label?: string }) {
  const ar = lang === "ar";
  return (
    <span
      className="paypal-chip relative hidden select-none items-center gap-1.5 overflow-hidden rounded-full border border-black/10 bg-white px-2.5 py-1 shadow-sm sm:inline-flex"
      title={ar ? "دفع حقيقي عبر PayPal Orders API — بيئة sandbox (بدون خصم)" : "Real PayPal Orders API checkout — sandbox (no real charges)"}
    >
      <PaypalMonogram size={16} />
      <PaypalWordmark className="text-[13px]" />
      <span className="text-[10px] font-black text-[#0070BA]">{label ?? (ar ? "الدفع" : "Checkout")}</span>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
    </span>
  );
}
