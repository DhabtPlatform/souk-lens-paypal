import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// POST /api/golden-run — instant replay of one REAL measured pipeline run
// (captured Nov 11, 2026 on this build against the bundled stall photo:
// 14 detections, complete products, per-model measured times).
// The One-click demo replays it immediately — honestly labeled in the UI —
// while Analyze always executes a fresh live run. No secrets in the payload.
export async function POST() {
  try {
    const file = path.join(process.cwd(), "data", "golden-run.json");
    const raw = await fs.readFile(file, "utf8");
    const j = JSON.parse(raw) as Record<string, unknown>;
    return NextResponse.json({ ok: true, replay: true, ...j });
  } catch {
    return NextResponse.json({ ok: false, error: "Golden run unavailable — use Analyze for a live run" }, { status: 404 });
  }
}
