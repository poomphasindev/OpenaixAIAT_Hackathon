"use client";

import { CloudFog, Gauge } from "lucide-react";
import { useState } from "react";
import { PatternRoulette } from "@/components/PatternRoulette";
import { WellnessRing } from "@/components/WellnessRing";
import { WeeklyLetter } from "@/components/WeeklyLetter";
import { PatternCard } from "@/components/PatternCard";
import { hiddenPatterns, thaiPatternAtlas, weeklyLetter } from "@/data/seed";
import type { DailyEntry, PatternMemory } from "@/lib/types";

function getWellnessScore(entry: DailyEntry) {
  return Math.max(28, Math.min(96, Math.round(
    entry.energy * 6 + entry.mood * 4 + entry.sleepQuality * 4 +
    (10 - entry.stress) * 3 + Math.min(entry.movement, 40) * 0.35
  )));
}

function moodColor(entry: DailyEntry): string {
  const s = getWellnessScore(entry);
  if (s >= 78) return "#6fa174";
  if (s >= 64) return "#f4c95d";
  if (s >= 50) return "#d98870";
  return "#b86c88";
}

export function InsightsScreen({
  entries, patterns, average
}: {
  entries: DailyEntry[];
  patterns: PatternMemory[];
  average: number;
}) {
  const [decisions, setDecisions] = useState(0);
  const [showLetter, setShowLetter] = useState(false);
  const last7 = entries.slice(-7);
  const maxScore = Math.max(...last7.map(getWellnessScore));
  const learningProgress = Math.min(100, 38 + decisions * 14);

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      <header className="pt-1">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">สัญญาณส่วนตัว</p>
        <h2 className="text-2xl font-black text-ink">สิ่งที่ Luma สังเกต</h2>
      </header>

      {/* Score overview */}
      <section className="app-panel">
        <div className="flex items-center gap-4">
          <WellnessRing score={average} size={88} label="เฉลี่ย 30 วัน" />
          <div className="flex-1 space-y-2">
            <div className="rounded-xl bg-mint/60 px-3 py-2">
              <p className="text-[10px] font-black uppercase text-moss">เทียบสัปดาห์ยาก</p>
              <p className="text-base font-black text-moss">+8 points ↑</p>
            </div>
            <div className="rounded-xl bg-peach/50 px-3 py-2">
              <p className="text-[10px] font-black uppercase text-coral/80">เช็คอินต่อเนื่อง</p>
              <p className="text-base font-black text-ink">15 วัน</p>
            </div>
          </div>
        </div>

        {/* 7-day sparkline */}
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss mb-2">พลังงาน 7 วัน</p>
          <div className="flex items-end gap-1.5 h-20">
            {last7.map((entry, i) => {
              const score = getWellnessScore(entry);
              const height = maxScore > 0 ? (score / maxScore) * 100 : 50;
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                  <span
                    className="sparkline-bar w-full"
                    style={{
                      height: `${height}%`,
                      background: moodColor(entry),
                      borderRadius: "6px 6px 0 0",
                      minHeight: 6
                    }}
                  />
                  <span className="text-[8px] font-black text-ink/35">
                    {entry.date.slice(8)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-lilac/40 border border-lilac px-4 py-3">
        <p className="text-[11px] font-bold text-ink/60 leading-5">
          <strong>Luma กำลังเรียนรู้ pattern ของคุณ</strong> ข้อสังเกตเหล่านี้ยังเป็นสัญญาณแรก ๆ ไม่ใช่ข้อสรุปแน่นอน คุณรู้จักตัวเองดีที่สุดเสมอ
        </p>
      </div>

      <section className="app-panel">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">Luma กำลังเรียนรู้</p>
            <h3 className="text-base font-black text-ink">คุณช่วยสอนความจำนี้อยู่</h3>
          </div>
          <Gauge size={22} className="text-moss" />
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/8">
          <div className="h-full rounded-full bg-leaf transition-all duration-500" style={{ width: `${learningProgress}%` }} />
        </div>
        <p className="mt-2 text-xs font-bold text-ink/50">รอบนี้คุณให้ feedback pattern แล้ว {decisions} ครั้ง</p>
      </section>

      <PatternRoulette patterns={hiddenPatterns} />

      <section className="app-panel">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">สรุป 7 วัน</p>
            <h3 className="text-base font-black text-ink">เป็นจดหมาย ไม่ใช่ dashboard</h3>
            <p className="mt-1 text-xs font-bold leading-5 text-ink/50">ให้กำลังใจ เข้าใจบริบทไทย และไม่วินิจฉัย</p>
          </div>
          <button className="rounded-full bg-ink px-3 py-2 text-xs font-black text-white" onClick={() => setShowLetter((value) => !value)}>
            {showLetter ? "ซ่อน" : "อ่านจดหมาย"}
          </button>
        </div>
      </section>

      {showLetter && <WeeklyLetter letter={weeklyLetter} />}

      <section className="space-y-2">
        <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-moss">pattern บริบทไทย</p>
        {thaiPatternAtlas.map((pattern) => (
          <article key={pattern.id} className="rounded-3xl border border-white/75 bg-white/82 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-peach text-coral">
                <CloudFog size={16} />
              </span>
              <div>
                <h3 className="text-sm font-black text-ink">{pattern.title}</h3>
                <p className="mt-1 text-xs leading-5 text-ink/58">{pattern.evidence}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-moss">{pattern.action}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Pattern cards */}
      <section className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss px-1">pattern ที่พบจากข้อมูล</p>
        {patterns.map((pattern) => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            basedOn={evidenceDays(pattern.id)}
            onDecision={() => setDecisions((value) => value + 1)}
          />
        ))}
      </section>
    </div>
  );
}

function evidenceDays(patternId: string) {
  const days: Record<string, string[]> = {
    "sleep-energy": ["1 พ.ค.: นอน 4/10, พลัง 4/10", "6 พ.ค.: นอน 3/10, พลัง 3/10", "8 พ.ค.: นอน 3/10, พลัง 3/10"],
    "caffeine-loop": ["16 เม.ย.: กาแฟ 4, นอน 3/10", "27 เม.ย.: กาแฟ 4, นอน 4/10", "6 พ.ค.: กาแฟ 4, นอน 3/10"],
    "workload-carryover": ["23 เม.ย.: งาน 9/10, เครียด 8/10", "4 พ.ค.: งาน 9/10, เครียด 8/10", "8 พ.ค.: งาน 8/10, เครียด 7/10"],
    "movement-buffer": ["21 เม.ย.: ขยับ 42 นาที, พลัง 8/10", "29 เม.ย.: ขยับ 38 นาที, พลัง 8/10", "7 พ.ค.: ขยับ 30 นาที, พลัง 8/10"]
  };
  return days[patternId] ?? [];
}
