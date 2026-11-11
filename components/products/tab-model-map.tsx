"use client";
import { Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Lang } from "@/lib/brand";

export type ModelTab = "analyze" | "generate" | "voice" | "compare" | "import" | "smart" | "mine";

type Entry = { model: string; ar: string; en: string; remote: boolean };

// Honest per-tab map: AI models do the AI work; local steps are labeled local.
const MAP: Record<ModelTab, Entry[]> = {
  analyze: [
    { model: "segmentation", ar: "عزل القطع من الصورة", en: "Segment items out of the photo", remote: true },
    { model: "listing", ar: "تعرّف + تسعير محلي + إعلان كامل", en: "Recognize + local price + full listing", remote: true },
    { model: "studio image", ar: "صورة ستوديو نظيفة", en: "Clean studio shot", remote: true },
  ],
  generate: [
    { model: "listing", ar: "إعلان كامل من الوصف", en: "Full listing from your words", remote: true },
    { model: "studio image", ar: "صورة ستوديو", en: "Studio shot", remote: true },
  ],
  voice: [
    { model: "voice", ar: "صوت → نص مكتوب", en: "Speech → written text", remote: true },
    { model: "listing", ar: "إعلان كامل من النص", en: "Full listing from the text", remote: true },
    { model: "studio image", ar: "صورة ستوديو", en: "Studio shot", remote: true },
  ],
  compare: [
    { model: "page fetch (local)", ar: "بيانات الرابط الحقيقية OG/JSON-LD", en: "Real link data OG/JSON-LD", remote: false },
    { model: "listing + web_search", ar: "مقارنة وبدائل وحكم نهائي", en: "Compare, alternatives & verdict", remote: true },
  ],
  import: [
    { model: "page fetch (local)", ar: "منتجات JSON-LD الحقيقية", en: "Real JSON-LD products", remote: false },
    { model: "listing", ar: "إكمال إعلانات المتجر", en: "Complete the store listings", remote: true },
  ],
  smart: [
    { model: "listing", ar: "فهم نية الشراء (حي مع المفتاح)", en: "Understand buying intent (live with key)", remote: true },
    { model: "souk ranker (local)", ar: "ترتيب: تقييم × خصم × توصيل × ثقة", en: "Rank: rating × discount × delivery × trust", remote: false },
  ],
  mine: [
    { model: "studio image", ar: "صور المتغيرات + زوايا 360°", en: "Variant shots + 360° angles", remote: true },
    { model: "glb builder (local)", ar: "ملف GLB حقيقي من الصورة — عرض 2.5D", en: "Real GLB from the photo — 2.5D view", remote: false },
  ],
};

export function TabModelMap({ tab, lang }: { tab: ModelTab; lang: Lang }) {
  const ar = lang === "ar";
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-accent/25 bg-accent/[0.04] px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-xs font-extrabold">
        <Cpu className="h-3.5 w-3.5 text-accent" />
        {ar ? "موديلات الذكاء في هذا التبويب" : "AI models in this tab"}
      </span>
      {MAP[tab].map((e) => (
        <span key={e.model} className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-[11px]">
          <span className="font-black" dir="ltr">{e.model}</span>
          <span className="text-muted-foreground">{ar ? e.ar : e.en}</span>
          {!e.remote ? (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">{ar ? "محلي" : "local"}</Badge>
          ) : null}
        </span>
      ))}
    </div>
  );
}
