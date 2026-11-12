# Souk Lens — "See it. Sell it. Pay with PayPal." (1:48)

Submission film for the **PayPal AI Hackathon**.

Real footage of the deployed app, one continuous story:

photo → segmentation → priced listings → the shopping agent → **PayPal sandbox checkout (create → approve → capture)** → seller channels → rigor → close.

## Package

| File | Purpose |
|---|---|
| `SOUK-LENS-FINAL.mp4` | The submission film — 1920×1080, 30 fps, H.264/AAC, **1:48**, English narration, burned-in chapter labels and captions |
| `SOUK-LENS-THUMBNAIL.jpg` | 1280×720 poster frame extracted from the film (for the YouTube thumbnail) |
| `FILM-SCRIPT.md` | Chapter map, the claims each scene makes, and the honesty rules the film follows |

## Upload checklist (Devpost requirement)

1. Upload `SOUK-LENS-FINAL.mp4` to YouTube as **Public** (not unlisted).
2. Suggested title: `Souk Lens — See it. Sell it. Pay with PayPal. | PayPal AI Hackathon`
3. Suggested description:
   > Souk Lens turns one market-stall photo into priced, sellable listings with AI, and
   > every sale completes through real PayPal checkout (Orders API: create → approve →
   > capture) in the PayPal sandbox — no real charges.
   > Live app: https://souk-lens-paypal.vercel.app · Code: https://github.com/DhabtPlatform/souk-lens-paypal
   > Music-free. AI voice narration generated for this film.
4. Set the thumbnail to `SOUK-LENS-THUMBNAIL.jpg`.
5. Paste the video URL into the Devpost submission and into `SUBMISSION.md`.

## What the film shows (chapter map)

| Chapter | Content | Why a judge should believe it |
|---|---|---|
| 01 Cold open | A real stall photograph, items boxed with numbered regions | The input is a phone photo, not a mock-up |
| 02–04 Analyze | Segmentation map, listing cards, studio shot, model timings | Every listing is bound to real pixels; timings are measured |
| 05 Smart Market | A stated need → three ranked lists → approved invoice | The agent turns intent into an orderable cart |
| 06–08 PayPal | Sandbox review (17.80 USD), buyer approval inside PayPal, **CAPTURED** with the capture id | The payment is real PayPal, not a simulation |
| 08–09 Seller | Seller dashboard and the four selling channels | Orders land in the seller's numbers; one listing, four channels |
| 09 Rigor | `GET /api/health` and the LIVE / DEMO / SAMPLE labels | Integration claims are verifiable and labeled |
| 10 Close | The live site URL and the repo | Everything in the film can be opened and checked |

## Honesty rules the film follows

- The checkout shown is **PayPal sandbox** — no money moves, and the film says so on screen.
- Sample marketplace items are labeled as samples; nothing is presented as real user data.
- The model timings come from real runs of the deployed build, not estimates.
- Narration in this cut is generated for the film (disclosed on the end card where the film uses an end card).
