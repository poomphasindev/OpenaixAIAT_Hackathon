"use client";

import { HelpCircle, Sparkles } from "lucide-react";
import type { LumaScore as LumaScoreType } from "@/lib/types";

const TONE_BAR: Record<LumaScoreType["tone"], string> = {
  flow: "#2f8f5b",
  friction: "#d49a2a",
  recovery: "#d98870",
  sos: "#b84a66"
};

export function LumaScore({ score, onWhy }: { score: LumaScoreType; onWhy?: () => void }) {
  const trendText = score.trend >= 0
    ? `สูงกว่าค่าเฉลี่ย ${score.trend} คะแนน`
    : `ต่ำกว่าค่าเฉลี่ย ${Math.abs(score.trend)} คะแนน`;

  return (
    <section className="luma-score-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">คะแนน Luma</p>
          <div className="mt-1 flex items-end gap-1">
            <span className="text-4xl font-black leading-none text-ink">{score.score}</span>
            <span className="pb-1 text-sm font-black text-ink/40">/100</span>
          </div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white">
          <Sparkles size={17} />
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/8">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score.score}%`, background: TONE_BAR[score.tone] }}
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className={`text-base font-black ${score.color}`}>{score.label}</p>
          <p className="text-xs font-bold text-ink/45">{trendText}</p>
          <p className="mt-1 text-xs font-bold text-ink/60">
            หลัก ๆ: {score.primaryFactors.join(" + ")}
          </p>
        </div>
        <button className="rounded-full bg-white px-3 py-2 text-xs font-black text-ink/62 shadow-sm" onClick={onWhy}>
          <span className="inline-flex items-center gap-1.5">
            <HelpCircle size={13} />
            เหตุผล
          </span>
        </button>
      </div>
    </section>
  );
}
