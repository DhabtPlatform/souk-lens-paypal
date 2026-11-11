# Souk Lens — "See it. Sell it. Pay with PayPal." (≤3:00)

Film package for the **PayPal AI Hackathon** submission.
Real app footage, measured runs, and a single continuous story:
photo → segmentation map → priced listing → Smart Market invoice → **PayPal sandbox checkout (create → approve → capture)** → seller profit truth → rigor → end card.

**Status:** script rewritten for the PayPal hackathon (`FILM-SCRIPT.md`); the previous MP4 is being re-recorded against the new PayPal-integrated build before submission. The new upload goes public on YouTube (required: under 3 minutes, publicly visible) with the link set in the Devpost submission.

## Package

| File | Purpose |
|---|---|
| `FILM-SCRIPT.md` | Chapter-by-chapter VO, on-screen copy, shot checklist, honesty rules |
| `SOUK-LENS-EN.srt` | English caption cues (update timings to the new VO mix when re-recorded) |
| `SOUK-LENS-THUMBNAIL.jpg` | 1920×1080 thumbnail / poster |
| `SOUK-LENS-ENDCARD.jpg` | 1920×1080 end-card still |
| `SHA256SUMS.txt` | Integrity checksums (refresh with the final cut) |

## What the new film must show

- **01 Problem** — goods, no listings, no payments; segmentation map in neon.
- **02 Capture & analyze** — boxes with real coordinates, priced listings, proof bar (LIVE/DEMO).
- **03 The agent** — Smart Market: need → 3 ranked lists → approve → invoice.
- **04 PayPal checkout ★** — cart → gold PayPal buttons → sandbox popup → CAPTURED id → order recorded, stock decremented, seller dashboard updated.
- **05 Seller truth** — profit reports from captured orders only; auction/live/campaign channels.
- **06 Rigor** — `/api/health` showing `ai` + `paypal` live checks; honesty labels everywhere.
- **07 Close** — tagline + end card (GitHub + "Payments powered by PayPal Orders API (sandbox)" + AI voiceover disclosure).

## Honesty / credits

- Male English **AI voiceover disclosed** on the end card.
- **No music**; SFX only.
- GitHub + PayPal sandbox note **only** on the final end card.
- Marketing copy stays universal: local price / local currency / auto-detected. Real app screens may show EGP; the labeled USD conversion appears once, on purpose.
- Fonts: **Inter**, **Space Grotesk**, **Manrope** (SIL Open Font License).
- Product imagery and app screens are from the Souk Lens app; see the repository `ATTRIBUTION.md`.
