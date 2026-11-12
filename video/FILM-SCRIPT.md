# SOUK LENS — FILM NOTES (PayPal AI Hackathon cut, 1:48)

The delivered film is `SOUK-LENS-FINAL.mp4`: 1920×1080, 30 fps, English narration,
chapter labels top-left, captions bottom-left, live app footage throughout.

This file records what each chapter claims, so the submission text and the film can be
checked against each other.

---

## 01 — COLD OPEN · 0:00–0:12
Real market-stall photograph; the line "EVERY MARKET STALL IS A STORE WAITING TO
HAPPEN."; marker "REAL MARKET PHOTO"; caption "REAL STALL. REAL GOODS. NO LISTING."
**Claim:** the demo starts from an unedited phone photo, not a prepared catalog.

## 02 — SEGMENTATION · 0:12–0:30
The segmentation map with numbered regions, then the resulting product list.
**Claim:** items are isolated with real model coordinates; each listing is bound to a
numbered region of the same photo.

## 03 — LISTING MODEL · 0:30–0:50
Product cards with names, prices, variants, stock and specs.
**Claim:** one photo produces complete, sellable listings — no typed fields.

## 04 — STUDIO + RELAY · 0:50–1:00
The studio shot and the model trace with per-model timings.
**Claim:** the pipeline is measured, not estimated; each stage is labeled live or demo.

## 05 — SMART MARKET · 1:00–1:15
A stated need ("furnish an apartment"), the three ranked lists, the approved list and
the preliminary invoice.
**Claim:** the agent turns buying intent into an orderable cart with an invoice.

## 06 — PAYPAL · 1:15–1:35
Cart totals, the gold PayPal buttons, the sandbox review screen (17.80 USD, Test Store,
sandbox buyer), then **CAPTURED**.
**Claim:** checkout runs on the PayPal Orders API in the sandbox — create → approve →
capture — and the capture is the order.

## 07 — SELLER · 1:35–1:45
The seller products view with cost/sales fields and the four channels (fixed, auction,
live sale, campaign).
**Claim:** captured orders feed seller numbers; one listing can be sold four ways.

## 08 — RIGOR · 1:45–1:52
`GET /api/health` and the LIVE / DEMO / SAMPLE labels.
**Claim:** every integration claim is verifiable from the deployed build.

## 09–10 — CLOSE
The live site URL, the repo, the sandbox disclosure.
**Claim:** everything in the film can be opened and checked by a judge.

---

## Rules this film obeys

- **Sandbox only.** The checkout is PayPal sandbox; no real charges. The film states it.
- **No invented data.** Sample inventory is labeled as sample; seller figures come from
  in-app orders.
- **Measured numbers.** Model timings come from real runs of the deployed build.
- **One story.** Photo → listings → agent → PayPal → seller, in that order, with no
  feature tour in between.
