// Minimal Model API client (OpenAI-compatible Responses + Images endpoints).
// Same base URL + Bearer auth for all models. Configure via env:
// MODEL_BASE_URL + MODEL_API_KEY, model ids via SEGMENT_MODEL / LISTING_MODEL /
// IMAGE_MODEL / VOICE_MODEL. Server egress passes the shared SSRF guard in
// lib/egress.ts (http/https public hosts only — never private/loopback).
import { assertPublicUrl } from "./egress";
import { KEYWORD_ITEMS, keywordOf, mockItem } from "./mock-grounding";

const BASE = process.env.MODEL_BASE_URL ?? "";
const KEY = process.env.MODEL_API_KEY ?? "";
const SEGMENT = process.env.SEGMENT_MODEL ?? "souk-segment-1";
const LISTING = process.env.LISTING_MODEL ?? "souk-listing-1";
const IMAGE = process.env.IMAGE_MODEL ?? "souk-image-1";

// Model ids surfaced in the UI proof bar / trace so they stay verifiable
// against the live provider response.
export const MODEL_IDS = { segment: SEGMENT, listing: LISTING, image: IMAGE } as const;

export const hasKey = () => KEY.length > 10;

function apiBase(): string {
  if (!BASE) throw new Error("MODEL_BASE_URL is not configured — live mode unavailable");
  return assertPublicUrl(BASE);
}

async function post(path: string, body: unknown) {
  const r = await fetch(`${apiBase()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    redirect: "error",
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`Model API ${path} failed: ${r.status} ${t.slice(0, 500)}`);
  }
  return r.json();
}

// 1. Segmentation via the Responses API — input items need {type:"message"}
export async function segmentImage(imageUrl: string, prompt: string) {
  if (!hasKey()) return mockSegments(prompt);
  const shortPrompt = prompt.split(",")[0].slice(0, 40) || "market goods";
  return post("/responses", {
    model: SEGMENT,
    input: [
      {
        type: "message",
        role: "user",
        content: [
          { type: "input_text", text: shortPrompt },
          { type: "input_image", image_url: imageUrl },
        ],
      },
    ],
  });
}

// 2. Listing AI: identify + price + listing JSON (structured output).
// Never names an item without its segmentation box — a pile of hazelnuts can
// never be described as a vase, because the link is structural.
export async function analyzeWithSpark(imageUrl: string, lang = "ar-EG", country = "EG", currency = "EGP", grounding = "") {
  if (!hasKey()) return mockAnalysis(grounding);
  const { FULL_PRODUCT_JSON_HINT } = await import("./product");
  return post("/responses", {
    model: LISTING,
    reasoning: { effort: "medium" },
    input: [
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: `You are Souk Lens. Look at this informal market photo carefully. Buyer country: ${country}, currency: ${currency}, language: ${lang}.
GROUNDING FROM SEGMENTATION (candidate items actually detected in THIS image): ${grounding || "none"}.
Rules: (1) List ONLY sellable objects that are VISIBLE in the image — never invent unrelated items (e.g. never call nuts, fruit or tools a vase or a lamp). (2) When the segmentation grounding names an item, identify that same item precisely and build its listing; use the grounding label unless the photo clearly shows something else. (3) If unsure about an object, describe it generically by what is visible rather than guessing a different object.
For each visible item fill ALL fields, fair local price, variants (colors/sizes when relevant) with own prices, specs, features, stock estimate, category, brand if visible. ${FULL_PRODUCT_JSON_HINT}`,
          },
          { type: "input_image", image_url: imageUrl },
        ],
      },
    ],
  });
}

// 3. Studio AI: clean studio shot from prompt
export async function cleanProductShot(prompt: string) {
  if (!hasKey()) return { mock: true, note: "Set MODEL_API_KEY to generate real image" };
  return post("/images/generations", {
    model: IMAGE,
    prompt: `Professional e-commerce studio photo, white background, soft light: ${prompt}`,
    n: 1,
  });
}

// 3b. Studio AI: per-variant studio shot (same product, this variant's color/size/material)
export async function variantShot(productName: string, variantLabel: string) {
  if (!hasKey()) return null;
  return post("/images/generations", {
    model: IMAGE,
    prompt: `Professional e-commerce studio photo, white background, soft light, same product: ${productName} — variant shown: ${variantLabel}. Keep product identity, change only the variant trait.`,
    n: 1,
  });
}

// 3c. Studio AI: multi-angle studio shots for a 360° viewer (front / right / back / left)
export const SPIN_ANGLES = ["front view", "right side view", "back view", "left side view"] as const;
export async function angleShot(productName: string, angle: string) {
  if (!hasKey()) return null;
  return post("/images/generations", {
    model: IMAGE,
    prompt: `Professional e-commerce studio photo, white background, soft light, product: ${productName} — camera angle: ${angle}. Same product, same colors, only the viewpoint changes.`,
    n: 1,
  });
}

// 4. Generic text call (with optional web search grounding + country hint)
export async function sparkText(prompt: string, opts?: { search?: boolean; country?: string }) {
  const body: Record<string, unknown> = {
    model: LISTING,
    reasoning: { effort: "medium" },
    input: [{ type: "message", role: "user", content: [{ type: "input_text", text: prompt }] }],
  };
  if (opts?.search) body.tools = [{ type: "web_search" }];
  return post("/responses", body);
}

// 5. Listing JSON from a text description (no image needed)
export async function listingFromText(desc: string, country = "EG", currency = "EGP") {
  if (!hasKey()) {
    // Grounded demo: the product is named after what was actually described, never a fixed placeholder.
    const grounded = mockItem(desc);
    if (grounded) return { mock: true, items: [{ ...grounded, description_ar: desc.slice(0, 220), description_en: desc.slice(0, 220) }] };
    const title = desc.trim().replace(/\s+/g, " ").slice(0, 42) || "منتج من الوصف";
    return {
      mock: true,
      items: [
        {
          name_ar: title, name_en: title,
          category: "General", category_ar: "عام", brand: "—",
          condition: "new",
          price: 450, compareAtPrice: 550, costPrice: 300,
          currency, stock: 12, sku: "SL-DEMO-01",
          description_ar: desc.slice(0, 220),
          description_en: desc.slice(0, 220),
          shortDescription_ar: desc.slice(0, 110),
          features: ["وصف بيعي جاهز", "متغيرات قابلة للتعديل", "صورة ستوديو مولدة"],
          specs: { Material: "—", Condition: "new" },
          variants: [{ name: "Standard", name_ar: "قياسي", price: 450, stock: 12 }],
          tags: ["souk-lens"], colors: [], sizes: [],
          shipping: "شحن حسب المدينة", warranty: "—",
          seoTitle: `${title} | Souk Lens`, seoDescription: desc.slice(0, 150),
        },
      ],
    };
  }
  const { FULL_PRODUCT_JSON_HINT } = await import("./product");
  return post("/responses", {
    model: LISTING,
    reasoning: { effort: "medium" },
    input: [
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: `You are Souk Lens catalog AI. Buyer country: ${country}, currency: ${currency}. From this description: "${desc}" — create ONE complete sellable listing (or more if description mentions multiple products). Fill every field: fair local price + compare-at + cost estimate, variants with own prices/stock, full specs, features, materials/colors/sizes, shipping/warranty defaults, SEO. ${FULL_PRODUCT_JSON_HINT} Arabic (Egyptian-friendly) + English.`,
          },
        ],
      },
    ],
  });
}

// 6. Voice transcription relay: WAV in → transcript JSON out.
// The voice model accepts a complete audio file only (no live streaming).
export async function transcribeAudio(buf: Buffer, filename = "voice.wav") {
  const form = new FormData();
  form.append(
    "request",
    new Blob([JSON.stringify({ mode: "PUSH_TO_TALK", model: process.env.VOICE_MODEL ?? "souk-voice-1", audioEncoding: "WAV", languageBias: ["Arabic", "English"] })], {
      type: "application/json",
    })
  );
  form.append("audio", new Blob([new Uint8Array(buf)], { type: "audio/wav" }), filename);
  const r = await fetch(`${apiBase()}/asr/transcribe`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
    redirect: "error",
  });
  if (!r.ok) throw new Error(`transcribe failed: ${r.status} ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

// 7. Fetch a public product/store URL + extract page meta tags + JSON-LD
// products server-side. Egress passes the shared guard (public hosts only).
export async function fetchPageMeta(url: string) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 12000);
  const target = assertPublicUrl(url);
  try {
    const r = await fetch(target, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 SoukLens-Hackathon-Demo/1.0" },
      redirect: "error",
    });
    const html = await r.text();
    const pick = (re: RegExp) => (html.match(re)?.[1] ?? "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").slice(0, 800);
    const images: string[] = [];
    for (const m of html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/gi)) images.push(m[1]);
    // JSON-LD Product extraction (real migrated data when present)
    const ldProducts: Record<string, unknown>[] = [];
    for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        const parsed = JSON.parse(m[1].trim()) as Record<string, unknown> | Record<string, unknown>[];
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        for (const o of arr) {
          const graph = (o as { "@graph"?: unknown })["@graph"];
          const nodes = Array.isArray(graph) ? (graph as Record<string, unknown>[]) : [o];
          for (const n of nodes) {
            const t = String((n as { "@type"?: string })["@type"] ?? "");
            if (t.toLowerCase().includes("product")) ldProducts.push(n);
          }
        }
      } catch { /* ignore malformed ld */ }
    }
    return {
      ok: true,
      status: r.status,
      title: pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) || pick(/<title>([^<]+)/i),
      image: images[0] ?? "",
      images: images.slice(0, 6),
      description: pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i) || pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i),
      price: pick(/<meta[^>]+property=["'][^"']*price[^"']*["'][^>]+content=["']([^"']+)/i),
      ldProducts: ldProducts.slice(0, 20),
      htmlLen: html.length,
    };
  } finally {
    clearTimeout(to);
  }
}

export function ldToRawItems(ldProducts: Record<string, unknown>[]): Record<string, unknown>[] {
  return ldProducts.map((p) => {
    const offers = (Array.isArray(p.offers) ? p.offers[0] : p.offers) as Record<string, unknown> | undefined;
    const imgs = Array.isArray(p.image) ? p.image : p.image ? [p.image] : [];
    return {
      name_en: String(p.name ?? "Imported product"),
      name_ar: String(p.name ?? "منتج مستورد"),
      description_ar: String(p.description ?? ""),
      description_en: String(p.description ?? ""),
      brand: String((p.brand as Record<string, unknown>)?.name ?? "—"),
      sku: String(p.sku ?? p.mpn ?? ""),
      price: Number(offers?.price ?? 0) || undefined,
      currency: String(offers?.priceCurrency ?? ""),
      image: String(imgs[0] ?? ""),
      images: imgs.map(String),
      category: String(p.category ?? "Imported"),
    };
  });
}

function mockSegments(prompt = "") {
  // Grounded demo: names what the user actually pointed at, never a fixed unrelated object.
  const key = keywordOf(prompt);
  const item = key ? KEYWORD_ITEMS[key] : null;
  return {
    mock: true,
    model: `${SEGMENT} (demo — set MODEL_API_KEY for live)`,
    detections: item
      ? [{ label: item.label, box: [0.18, 0.15, 0.82, 0.85] }]
      : [
          { label: "brass lamp", box: [0.12, 0.2, 0.4, 0.7] },
          { label: "ceramic vase", box: [0.52, 0.3, 0.78, 0.8] },
        ],
  };
}

function mockAnalysis(grounding = "") {
  const grounded = mockItem(grounding);
  return {
    mock: true,
    model: `${LISTING} (demo — set MODEL_API_KEY for live)`,
    items: grounded ? [grounded] : [mockItem("lamp")!, mockItem("vase")!],
  };
}
