# SOUK LENS — "SEE IT. SELL IT. PAY WITH PAYPAL."
### The 2:50 engineering film — PayPal AI Hackathon

**Format:** 1920×1080 · 25 fps · male English voice · no music, SFX only · end card shows only GitHub + PayPal sandbox note.

**Thesis:** AI that writes listings is everywhere. AI that sells — and gets paid — is not. Souk Lens turns any market photo into priced listings and completes every sale through real PayPal checkout (Orders API: create → approve → capture).

---

## 01 — THE PROBLEM · 0:00–0:20
**VO:** Every informal market runs the same way: goods on a table, prices in someone's head, and sales settled by hand or chat messages. AI can describe a photo — but describing is not selling. Selling means a real checkout, a real capture, money that actually moves.

**On screen:** real stall photo → "EVERY PRODUCT. ZERO LISTINGS. NO PAYMENTS." → segmentation map appears (neon boxes 01–06).

## 02 — CAPTURE & ANALYZE · 0:20–0:50
**VO:** One phone photo. Segmentation isolates every item into numbered boxes — real coordinates, not guesses. The listing AI prices each item in local currency and writes the full product: variants, stock, specs. The image model cleans the studio shot. Each model's time lands on the proof bar, labeled LIVE or DEMO.

**On screen:** live analysis run → box map → product cards stacking → proof bar timings.

## 03 — THE AGENT BUILDS THE CART · 0:50–1:15
**VO:** On the buyer side, an agent does the shopping: state a need — "furnish a small apartment" — and it assembles three ranked lists from the store and the seller's saved products, moves items between lists, and turns the approved list into a preliminary invoice.

**On screen:** Smart Market tab → 3 lists → approve → invoice (subtotal, savings, shipping, total).

## 04 — PAYPAL CHECKOUT · 1:15–1:55  ★ THE SCENE
**VO:** And this is where Souk Lens stops being a demo: the buyer pays with real PayPal. The gold buttons open PayPal itself — the buyer approves inside PayPal's window, and the server captures the payment through the Orders API. The capture id becomes the order. Stock decrements. The seller's report updates. No mock. No simulation. PayPal is the payment rail of the whole platform.

**On screen:** cart with totals → PayPal gold buttons → sandbox popup approval → "CAPTURED" + capture id → order recorded toast → seller dashboard profit updates.

## 05 — SELLER TRUTH · 1:55–2:20
**VO:** The seller sees profit the honest way: revenue and costs from orders that were actually captured — never generated numbers. Every product converts to a channel: fixed price, auction with live bidding, live sale, or external campaign.

**On screen:** profit report → auction conversion → bid simulation (labeled) → channels on the card.

## 06 — RIGOR · 2:20–2:38
**VO:** Everything is verifiable: /api/health reports the AI provider and PayPal reachability live — without exposing a single secret. Demo runs say DEMO. Sample data says sample. The one honest exception: when PayPal sandbox credentials are absent, the checkout shows exactly that instead of pretending.

**On screen:** `GET /api/health` JSON (ai + paypal sections) → honesty labels.

## 07 — CLOSE · 2:38–2:50
**VO:** Souk Lens. See it. Sell it. Pay with PayPal.

**On screen:** giant tagline → end card: SOUK LENS logo · github.com/DhabtPlatform/souk-lens-paypal · "Payments powered by PayPal Orders API (sandbox)" · AI voiceover disclosure.

---

## Shot checklist (real app footage only)
- [ ] One-click demo run + proof bar (LIVE label)
- [ ] Box map tap → listing → Add to cart
- [ ] Cart → **PayPal sandbox buttons → popup → approve → CAPTURED id** ← the money shot
- [ ] Buyer page PayPal button (single product)
- [ ] Smart Market: preset → 3 lists → approve → invoice → add to cart
- [ ] Seller dashboard after capture (revenue moved)
- [ ] `/api/health` response on screen

## Honesty rules for the film
- Sandbox only — say it on screen ("PayPal sandbox").
- AI voiceover disclosed on the end card; no music.
- Show the conversion label once (EGP → USD labeled rate) — honesty is a feature.
