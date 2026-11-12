# Souk Lens — عدسة السوق

**An AI commerce platform for informal markets — with PayPal checkout end-to-end.**
Snap a messy market stall → AI segmentation isolates every item on an interactive map →
the listing AI prices each item locally and writes a complete product → the image model
cleans the studio shot → **buyers pay with real PayPal Smart Buttons (Orders API:
create → approve → capture)**. Voice, text, links and whole-store import all work too.

> **PayPal is central, not decorative.** Every purchase path — the buyer product page,
> the cart checkout, and the Smart Market agent's approved list — ends in a real PayPal
> Orders API flow with server-side money math. See [PayPal integration](#paypal-integration).

## Judge in 2 minutes

1. Open the app — press **"One-click demo"**: one stall photo → interactive segmentation map → complete priced listings.
2. Tap any box on the map → open its listing → **Add to cart**.
3. Open the cart → **real PayPal sandbox buttons** (gold) sit under the total → pay with a PayPal sandbox buyer account → capture completes → the order is recorded in seller sales and stock decrements.
4. Or open any product's **buyer page** (`/product/[id]`) — a PayPal buy button is right under Add to cart.
5. Try **Smart Market**: type a need → the agent assembles 3 ranked lists → approve → invoice → add to cart → PayPal.
6. Verify integrations live: `GET /api/health` reports `ai` (key configured, provider reachable) and `paypal` (configured, env, OAuth reachability) — never any secret.
7. Everything is honestly labeled: demo runs say **DEMO**, sample catalog data is labeled, and sales reports record **only real captured orders**.

## PayPal integration

| Path | Flow |
|---|---|
| **Product page** (`/product/[id]`) | PayPal button under Add to cart → one-item order |
| **Cart checkout** | PayPal buttons under the total → multi-item order with the exact invoice math |
| **Smart Market** | Agent builds lists → user approves → invoice → add to cart → PayPal |

- **Server-side money math** (`lib/paypal.ts`): amounts are computed on the server (unit × qty + the same shipping rule the invoice UI shows); the client never sends a total.
- **Orders API v2**: `POST /api/paypal/orders` creates the order server-side → the buyer approves inside PayPal's popup → **capture runs via PayPal's standard SDK helper `actions.order.capture()`** in the buyer's browser (the approval token stays inside the PayPal popup session; buyer credentials and order ids never route through this app's server).
- **Sandbox by default**: `PAYPAL_API_BASE` defaults to `https://api-m.sandbox.paypal.com`; flip it + live credentials for production.
- **Currency honesty**: PayPal settles a fixed currency set (no EGP). Unsupported cart currencies convert to `PAYPAL_CURRENCY` at a **labeled fixed rate** — the label is shown next to the buttons and in a toast at order creation.
- **Sales truth**: unit sales are recorded **only from real PayPal-captured orders** (plus a clearly-labeled no-payment demo button for offline walkthroughs).
- **Egress guard**: every server fetch (PayPal OAuth + Orders, model API, page fetches) validates scheme + host through the shared guard in `lib/egress.ts` — http/https public hosts only, never private/loopback/reserved.

## Significant update for this submission (required disclosure)

This project **pre-dates the hackathon submission period** and was **significantly
updated after it began (Oct 1 – Nov 12, 2026)**. What changed:

1. **Real PayPal commerce end-to-end** — the previous build had only a mock checkout.
   This update added the full PayPal Orders API integration across every purchase path:
   server-side order creation, Smart Payment Buttons on the product page and cart,
   capture-based order recording, sandbox/live configuration, labeled currency
   conversion, and a PayPal health probe in `/api/health`.
2. **Provider-neutral AI pipeline** — the AI layer was refactored into `lib/ai.ts`
   behind env configuration (`MODEL_BASE_URL` + `MODEL_API_KEY` + model ids), so any
   OpenAI-compatible provider works without code changes.
3. **Shared egress guard** (`lib/egress.ts`) on all server-side fetches.
4. Tests, typecheck and docs refreshed; no feature was removed.

The app's core value (photo → segmentation → priced listing → market platform) is
original work built during October 2026 as documented in the git history and
`ATTRIBUTION.md`; the PayPal layer above is the substantial post-submission update.

## AI pipeline

| Tab | Input | Models |
|---|---|---|
| Analyze image | Photo / URL | segmentation → listing → studio image |
| Generate from text | Text only | listing + studio image |
| Compare URL | External product link | page fetch + listing + web_search |
| Voice listing | Mic recording / text | voice transcribe + listing |
| Import store | Old store link | page fetch (JSON-LD) + listing bulk |
| Smart Market | "I want to buy…" + presets | agent intent + ranked lists + invoice + PayPal |
| My products | Local save | internal DB (`data/products.json`, capped at 100) |

Every run shows a **proof bar**: per-model time and a **LIVE/DEMO** label — no hidden
simulations. Without keys the same pipeline runs in an honestly-labeled demo mode.

## Run it

```bash
npm install
cp .env.example .env   # set PayPal sandbox creds (required for checkout) + AI key (optional)
npm run dev            # http://localhost:3000
npm run typecheck      # static safety
npm test               # 28 unit tests: share links, economics, box parsing, rate limit
```

**Testing access (free):**
- **AI**: works with no key (demo mode). For live runs set `MODEL_API_KEY` + `MODEL_BASE_URL` (any OpenAI-compatible provider).
- **PayPal — sandbox only for this submission, no real money moves.** Create a sandbox app at [developer.paypal.com](https://developer.paypal.com) → **Apps & Credentials → Sandbox** → copy the client id + secret into `.env` (the default `PAYPAL_API_BASE` already points at the sandbox). Sandbox **buyer** test accounts (to click through checkout) are provided under **Sandbox → Test Accounts**. To go live later: use live credentials AND set `PAYPAL_API_BASE=https://api-m.paypal.com` — mismatched pairs fail auth.
- `GET /api/health` verifies both integrations are live without exposing secrets. Sandbox buyer credentials for judges are listed in [SUBMISSION.md](SUBMISSION.md).

## Where everything lives (nothing hidden)

- `lib/paypal.ts` — PayPal Orders API v2 client (OAuth cache, create/capture, money quantization, SSRF-guarded base URL)
- `app/api/paypal/config/route.ts` — public runtime config (client id, env, currency) for the buttons
- `app/api/paypal/orders/route.ts` — create order (zod-validated, server-side totals)
- `components/paypal/paypal-buttons.tsx` — Smart Payment Buttons (SDK loader, popup approval + capture, conversion label, honest no-config notice)
- `components/cart/cart-sheet.tsx` — cart checkout with PayPal + labeled demo fallback
- `components/products/product-buyer-view.tsx` — buyer page with PayPal buy button
- `lib/ai.ts` — provider-neutral model client (segmentation / listing / studio / voice)
- `lib/egress.ts` — shared SSRF guard for all server egress
- `lib/extract.ts` — native box parsing (`box;x1=..;w=..`) → interactive segmentation map
- `app/api/lens/route.ts` — the full photo pipeline (segmentation → grounding → listing → studio → crops)
- `components/smart/smart-market.tsx` — the shopping agent (3 ranked lists → invoice → cart → PayPal)
- `components/products/seller-dashboard.tsx` + `lib/analytics.ts` — profit reports from real captured orders only

## Honesty rules (enforced, not claimed)

- Sample marketplace inventory is labeled; no invented reviews, ratings or sales history.
- Seller reports use **real entries only** — units sold come from actual in-app orders backed by PayPal captures (checkout also decrements stock).
- Selling channels (auction / live / campaign) are saved per product; the bid simulation is labeled as a simulation.
- The segmentation map uses the model's real `box;x1=..;w=..` coordinates; the evenly-placed fallback is labeled "Estimated demo positions".
- Impact numbers are measured on-device from real runs; the manual-time baseline is labeled a market estimate.

## Demo video

**[video/SOUK-LENS-FINAL.mp4](video/SOUK-LENS-FINAL.mp4)** — **1:48**, 1920×1080, 30 fps,
English narration, chapter labels and captions burned in. Real footage of the deployed
build: stall photo → segmentation → listings → the agent → **PayPal sandbox checkout
(create → approve → capture)** → seller channels → rigor → close.
YouTube link (public) is in the Devpost submission; thumbnail and the chapter map are in
[`video/`](video/README.md).

## Brand

"A lens that found the gem" — a souk arch inside a lens ring + a gold discovery dot.
Tagline: **See it. Sell it. Anywhere.** AR = RTL (Tajawal/Cairo), EN = LTR (Inter) —
alignment, arrows, sliders and prices follow the UI language. Full identity: `/brand`.

## Roadmap

- **Agentic commerce next:** the Smart Market agent proposes; the buyer approves; PayPal executes — next step is full one-tap agent checkout within PayPal's buyer-approval flow.
- Realtime bidding gateway, AI budget negotiation in Smart Market, live-selling item tracking.
- PWA distribution first (sellers live on WhatsApp, not app stores); the price graph compounds into a data moat.

## License

MIT — see [LICENSE](LICENSE). Demo catalog photos are Unsplash; brand imagery is
project-generated; fonts are OFL — details in [ATTRIBUTION.md](ATTRIBUTION.md).


