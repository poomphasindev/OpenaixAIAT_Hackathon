"use client";

import { Check, RotateCw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { discoveredCount, nextHiddenPattern } from "@/lib/patterns";
import type { HiddenPattern } from "@/lib/types";

export function PatternRoulette({ patterns }: { patterns: HiddenPattern[] }) {
  const [revealed, setRevealed] = useState<HiddenPattern | null>(patterns.find((p) => p.status === "revealed") ?? null);
  const [spinning, setSpinning] = useState(false);
  const discovered = useMemo(() => discoveredCount(patterns) + (revealed?.status === "hidden" ? 1 : 0), [patterns, revealed]);
  const hidden = Math.max(0, patterns.length - discovered);

  function spin() {
    setSpinning(true);
    window.setTimeout(() => {
      setRevealed(nextHiddenPattern(patterns));
      setSpinning(false);
    }, 420);
  }

  return (
    <section className="app-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">ค้นพบ pattern</p>
          <h3 className="text-base font-black text-ink">ยังมี pattern ซ่อนอยู่ {hidden} ข้อ</h3>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-peach text-coral">
          <Search size={17} />
        </span>
      </div>

      <button className="mt-4 w-full rounded-2xl bg-ink px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white" onClick={spin}>
        <span className="inline-flex items-center gap-2">
          <RotateCw size={14} className={spinning ? "animate-spin" : ""} />
          กดเพื่อเปิดดู
        </span>
      </button>

      {revealed && (
        <article className={`pattern-reveal mt-4 ${spinning ? "pattern-reveal-spin" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-ink">{revealed.title}</h4>
              <p className="mt-1 text-xs font-bold leading-5 text-ink/58">{revealed.description}</p>
            </div>
            <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-black text-moss">{revealed.confidence}%</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {revealed.evidence.slice(0, 3).map((item) => (
              <p key={item} className="rounded-xl bg-white/72 px-3 py-2 text-[10px] font-bold text-ink/55">{item}</p>
            ))}
          </div>
          <p className="mt-3 text-xs font-black text-moss">{revealed.reward}</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-black text-white"><Check size={11} className="inline" /> ตรงนะ</button>
            <button className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-ink/58 shadow-sm"><X size={11} className="inline" /> ไม่ใช่ฉัน</button>
          </div>
        </article>
      )}

      <p className="mt-3 text-xs font-black text-ink/48">ค้นพบแล้ว: {Math.min(patterns.length, discovered)}/{patterns.length}</p>
    </section>
  );
}
