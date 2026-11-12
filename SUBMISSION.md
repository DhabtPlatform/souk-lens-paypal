# Devpost submission — copy-paste ready

> عربي: ده النص الكامل لفورم الـ Devpost. المستخدم يعوّض الـ placeholders
> المعلّمة بـ `⟨...⟩` (رابط اليوتيوب + بيانات حساب الـ sandbox الديمو) ويلزق كل
> قسم في الخانه المناسبة. كل النصوص إنجليزي لأن الشروط تطلبها.

---

## Project title

**Souk Lens — See it. Sell it. Pay with PayPal.**

## Elevator pitch (short description field)

AI commerce platform for informal markets: snap a market stall, AI segmentation
isolates every item and prices it locally, complete listings are ready in under a
minute — and every sale completes through **real PayPal checkout (Orders API)**.

## Full description (features & functionality)

**The problem.** Informal-market sellers photograph their goods and sell over chat.
AI can describe a photo, but describing is not selling: nothing completes the sale,
nothing records the money.

**What Souk Lens does.** One journey from photo to paid order:

1. **Analyze a stall photo** — the segmentation model isolates every sellable item
   into numbered interactive boxes (real `box;x1=..;w=..` coordinates, never invented
   positions; a fallback grid is honestly labeled "estimated demo positions").
2. **Listing AI** — each item becomes a complete product: AR/EN names, fair local
   price + compare-at + cost, variants with photos, specs, stock, SKU, shipping and
   SEO. Wrong name? Tap the box, type the right one, the region re-analyzes.
3. **Studio AI** — the hero shot is cleaned into a studio image (before/after slider);
   per-variant shots and 360° angles generate on demand.
4. **Other inputs** — text, voice (WAV transcription), external product links
   (real OG/JSON-LD data + web-search comparisons), and whole-store import.
5. **Smart Market (the shopping agent)** — state a need ("furnish a small
   apartment"); the agent assembles three ranked lists from the store inventory and
   the seller's real saved products, lets the buyer move items between lists, and
   turns the approved list into a preliminary invoice.
6. **PayPal checkout — central, not decorative.** Every purchase path ends in real
   PayPal:
   - `POST /api/paypal/orders` creates the order **server-side** (zod-validated;
     money math computed on the server — the client never sends a total).
   - The buyer approves inside PayPal's own popup window.
   - Capture runs via PayPal's standard SDK helper `actions.order.capture()` in the
     buyer's browser; the capture id becomes the order.
   - Seller sales reports and stock update **only from real captured orders**.
   - `GET /api/health` verifies AI and PayPal reachability live — without exposing
     any secret.
   - Currencies PayPal doesn't settle (e.g. EGP) convert to `PAYPAL_CURRENCY` at a
     labeled fixed rate, shown next to the buttons.
7. **Seller OS** — profit reports (revenue, cost, margin, inventory value) from real
   captured orders only; selling channels per product: fixed, **auction** (with a
   labeled bid simulation), live sale, external campaign.
8. **AR/EN + RTL/LTR** — alignment, sliders, prices and arrows follow the UI
   language; first-visit geo-detects country/currency/language.
9. **Honesty everywhere** — demo runs say DEMO, sample data is labeled, the
   no-credentials state says exactly what to add instead of pretending.

## How this submission uses PayPal + AI

PayPal is the payment rail of the whole platform (product page → cart → agent-approved
invoice, all through Orders API v2 + Smart Payment Buttons in the sandbox). The AI
layer is provider-neutral (`lib/ai.ts` behind env config) — segmentation grounds
listings to real image boxes, the listing model writes complete commerce-ready
products, and the agent ranks what the buyer actually needs.

## Significant update disclosure (required for pre-existing work)

This project pre-dates the submission period and was **significantly updated after
the submission period began (Oct 1 – Nov 12, 2026)**:

- **Added the real PayPal commerce layer** — the previous build had only a mock
  checkout. This update added server-side order creation, Smart Payment Buttons on
  every purchase path, capture-based order recording, sandbox configuration, labeled
  currency conversion, and a live PayPal health probe.
- Refactored the AI layer to be provider-neutral, added a shared SSRF egress guard,
  refreshed tests (28 passing), docs, and the demo video script.

Original work (photo → segmentation → priced listing → market platform) was built
during October 2026 and is documented in the repo.

## Demo video

Local file in the repo: `video/SOUK-LENS-FINAL.mp4` (1:48, 1920×1080, English narration).

⟨PASTE PUBLIC YOUTUBE LINK HERE — upload the file as **Public**, not unlisted⟩

## Repository (public, MIT)

https://github.com/DhabtPlatform/souk-lens-paypal

## Free testing access (required by rules)

Everything runs **free of charge** through judging:

- **Live app:** https://souk-lens-paypal.vercel.app — press **"One-click demo"**;
  no account needed.
- **AI**: works in demo mode with no key. For live AI runs set `MODEL_API_KEY` +
  `MODEL_BASE_URL` (any OpenAI-compatible provider).
- **PayPal — sandbox only, no real money moves.** The deployed checkout uses
  PayPal's sandbox environment. Judges can pay with a sandbox buyer account
  (from https://developer.paypal.com → Sandbox → Test Accounts):

  ```
  Sandbox buyer email:    ⟨YOUR-SANDBOX-BUYER-EMAIL⟩
  Sandbox buyer password: ⟨YOUR-SANDBOX-BUYER-PASSWORD⟩
  ```

  Run locally: `npm install` → `cp .env.example .env` → paste sandbox creds →
  `npm run dev`. `GET /api/health` verifies both integrations.

## Built with

Next.js 15 · React 19 · TypeScript · Tailwind · PayPal Orders API v2 + PayPal JS SDK ·
OpenAI-compatible model APIs (segmentation / listing / image / voice) · sharp · Vitest
