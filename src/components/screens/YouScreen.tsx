"use client";

import { CalendarDays, Download, Globe2, HeartPulse, Lock, ShieldCheck, Sparkles, Trash2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { PatternCard } from "@/components/PatternCard";
import { WeeklyLetter } from "@/components/WeeklyLetter";
import { demoUser, weeklyLetter } from "@/data/seed";
import type { DailyEntry, Language, PatternMemory } from "@/lib/types";

const COPY = {
  th: {
    title: "You",
    subtitle: "Memory landscape ของ Beam",
    privacy: "ข้อมูลทั้งหมดอยู่ในเครื่องนี้",
    landscape: "แผนที่ชีวิต 30 วัน",
    hint: "แตะวันเพื่อดูเรื่องราว",
    monthReport: "รายงานเดือนนี้",
    monthSubtitle: "ภาพรวมจาก diary mock 30 วัน",
    dailyReport: "รายงานวันนี้",
    monthlyTakeaway: "สิ่งที่เห็นชัด",
    nextExperiment: "สิ่งที่ลองต่อ",
    patterns: "Pattern ที่ Luma เริ่มเห็น",
    settings: "ตั้งค่าและสิทธิ์ข้อมูล",
    language: "ภาษา",
    export: "Export memory JSON",
    delete: "ล้างข้อมูล demo",
    deleted: "ล้างข้อมูลแล้ว",
    safety: "RoutineSense ไม่ใช่บริการแพทย์หรือฉุกเฉิน หากไม่ปลอดภัย โทร 1323 หรือ 02-713-6793",
    energy: "พลัง",
    stress: "เครียด",
    sleep: "นอน",
    movement: "ขยับ",
    friction: "จุดติดขัด"
  },
  en: {
    title: "You",
    subtitle: "Beam's memory landscape",
    privacy: "All data stays on this device",
    landscape: "30-day life landscape",
    hint: "Tap any day for its story",
    monthReport: "Monthly report",
    monthSubtitle: "A human summary from 30 mock diary days",
    dailyReport: "Daily report",
    monthlyTakeaway: "Main takeaway",
    nextExperiment: "Next experiment",
    patterns: "Patterns Luma noticed",
    settings: "Settings and data rights",
    language: "Language",
    export: "Export memory JSON",
    delete: "Clear demo data",
    deleted: "Data cleared",
    safety: "RoutineSense is not medical or emergency care. If unsafe in Thailand, call 1323 or 02-713-6793.",
    energy: "Energy",
    stress: "Stress",
    sleep: "Sleep",
    movement: "Move",
    friction: "Friction"
  }
} satisfies Record<Language, Record<string, string>>;

export function YouScreen({
  entries,
  patterns,
  language,
  onLanguage
}: {
  entries: DailyEntry[];
  patterns: PatternMemory[];
  language: Language;
  onLanguage: (language: Language) => void;
}) {
  const copy = COPY[language];
  const [selected, setSelected] = useState(entries[entries.length - 1]);
  const [deleted, setDeleted] = useState(false);
  const recentEntries = useMemo(() => entries.slice(-30), [entries]);
  const report = useMemo(() => buildMemoryReport(recentEntries, language), [recentEntries, language]);

  function exportMemory() {
    const payload = JSON.stringify({
      user: demoUser,
      exportedAt: new Date().toISOString(),
      entries: recentEntries,
      patterns
    }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "routinesense-memory.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      <header className="pt-1">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">Memory</p>
        <h1 className="text-2xl font-black leading-tight text-ink">{copy.title}</h1>
        <p className="mt-1 text-xs font-bold leading-5 text-ink/50">{copy.subtitle}</p>
      </header>

      <section className="app-panel">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-ink text-white">
            <UserRound size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-ink">{demoUser.name}</h2>
            <p className="text-xs font-bold text-ink/52">{demoUser.city} · {demoUser.joinedDaysAgo} days · {demoUser.goal}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-mint/60 px-3 py-2 text-xs font-black text-moss">
          <Lock size={14} />
          {copy.privacy}
        </div>
      </section>

      <MonthlyReport report={report} language={language} />

      <section className="app-panel">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.landscape}</p>
            <p className="text-xs font-bold text-ink/45">{copy.hint}</p>
          </div>
          <Legend />
        </div>
        <div className="memory-grid">
          {recentEntries.map((entry) => (
            <button
              key={entry.id}
              className={`memory-day ${selected.id === entry.id ? "memory-day-active" : ""}`}
              style={{ background: dayColor(entry) }}
              onClick={() => setSelected(entry)}
              aria-label={`${entry.date}: ${entry.energy}/8`}
            >
              {new Date(entry.date).getDate()}
            </button>
          ))}
        </div>
        <DayDetail entry={selected} language={language} />
      </section>

      <section className="app-panel">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.patterns}</p>
        <div className="space-y-3">
          {patterns.slice(0, 3).map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              language={language}
              basedOn={recentEntries.slice(-5).map((entry) => `${entry.date}: energy ${entry.energy}, stress ${entry.stress}`)}
            />
          ))}
        </div>
      </section>

      <WeeklyLetter letter={weeklyLetter} language={language} />

      <section className="app-panel">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.settings}</p>
        <div className="grid grid-cols-2 gap-2">
          <button className={`language-toggle ${language === "en" ? "language-toggle-active" : ""}`} onClick={() => onLanguage("en")}>
            <Globe2 size={14} />
            English
          </button>
          <button className={`language-toggle ${language === "th" ? "language-toggle-active" : ""}`} onClick={() => onLanguage("th")}>
            <Globe2 size={14} />
            ไทย
          </button>
        </div>
        <div className="mt-3 grid gap-2">
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-xs font-black text-white" onClick={exportMemory}>
            <Download size={15} />
            {copy.export}
          </button>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-peach px-4 text-xs font-black text-coral" onClick={() => setDeleted(true)}>
            <Trash2 size={15} />
            {deleted ? copy.deleted : copy.delete}
          </button>
        </div>
      </section>

      <section className="app-panel border border-coral/20">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-coral" />
          <p className="text-xs font-bold leading-5 text-ink/60">{copy.safety}</p>
        </div>
      </section>
    </div>
  );
}

function DayDetail({ entry, language }: { entry: DailyEntry; language: Language }) {
  const copy = COPY[language];
  const helped = entry.recommendationHelped
    ? language === "th" ? "คำแนะนำวันนั้นช่วยให้วันไม่หลุดมาก" : "The recommendation seemed to keep the day from sliding further."
    : language === "th" ? "คำแนะนำวันนั้นยังไม่พอดี ต้องลองปรับให้เล็กลง" : "The recommendation did not quite fit yet; the next version should be smaller.";
  return (
    <article className="mt-4 rounded-2xl bg-white/74 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-ink">{entry.date}</h3>
          <p className="mt-1 text-xs font-bold leading-5 text-ink/52">{entry.rawText}</p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ background: dayColor(entry) }}>
          {Math.round((entry.energy / 8) * 100)}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        <MiniStat label={copy.energy} value={String(entry.energy)} />
        <MiniStat label={copy.stress} value={String(entry.stress)} />
        <MiniStat label={copy.sleep} value={String(entry.sleepQuality)} />
        <MiniStat label={copy.movement} value={`${entry.movement}m`} />
      </div>
      <p className="mt-3 rounded-xl bg-paper/80 px-3 py-2 text-xs font-bold leading-5 text-ink/55">
        {copy.friction}: {entry.frictionReason}
      </p>
      <div className="mt-3 grid gap-2">
        <div className="rounded-xl bg-mint/45 px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-wide text-moss">{copy.dailyReport}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-ink/58">{helped}</p>
        </div>
        <div className="rounded-xl bg-white/80 px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-wide text-ink/36">{copy.nextExperiment}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-ink/60">{entry.tomorrowIntent}</p>
        </div>
      </div>
    </article>
  );
}

type MemoryReport = {
  averageEnergy: number;
  averageStress: number;
  shortSleepDays: number;
  highAqiDays: number;
  bestDay: DailyEntry;
  hardestDay: DailyEntry;
  takeaway: string;
  experiment: string;
};

function MonthlyReport({ report, language }: { report: MemoryReport; language: Language }) {
  const copy = COPY[language];

  return (
    <section className="app-panel">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.monthReport}</p>
          <h2 className="text-lg font-black leading-6 text-ink">{copy.monthSubtitle}</h2>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-ink text-white">
          <CalendarDays size={17} />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ReportStat icon={HeartPulse} label="Avg energy" value={`${report.averageEnergy}/8`} />
        <ReportStat icon={Sparkles} label="Avg stress" value={`${report.averageStress}/10`} />
        <ReportStat icon={CalendarDays} label="Short sleep" value={`${report.shortSleepDays} days`} />
        <ReportStat icon={ShieldCheck} label="High AQI tags" value={`${report.highAqiDays} days`} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-mint/50 p-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-moss">Best day</p>
          <p className="mt-1 text-sm font-black text-ink">{report.bestDay.date}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-ink/55">{report.bestDay.frictionReason}</p>
        </div>
        <div className="rounded-2xl bg-peach/55 p-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-coral">Hardest day</p>
          <p className="mt-1 text-sm font-black text-ink">{report.hardestDay.date}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-ink/55">{report.hardestDay.frictionReason}</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-white/75 p-3">
        <p className="text-[10px] font-black uppercase tracking-wide text-moss">{copy.monthlyTakeaway}</p>
        <p className="mt-1 text-sm font-bold leading-6 text-ink/68">{report.takeaway}</p>
      </div>
      <div className="mt-2 rounded-2xl bg-ink px-3 py-3 text-white">
        <p className="text-[10px] font-black uppercase tracking-wide text-white/50">{copy.nextExperiment}</p>
        <p className="mt-1 text-sm font-black leading-5">{report.experiment}</p>
      </div>
    </section>
  );
}

function ReportStat({ icon: Icon, label, value }: { icon: typeof HeartPulse; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/74 p-3">
      <div className="flex items-center gap-1.5 text-ink/42">
        <Icon size={13} />
        <p className="text-[9px] font-black uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-1 text-lg font-black text-ink">{value}</p>
    </div>
  );
}

function buildMemoryReport(entries: DailyEntry[], language: Language): MemoryReport {
  const averageEnergy = Math.round((entries.reduce((sum, entry) => sum + entry.energy, 0) / entries.length) * 10) / 10;
  const averageStress = Math.round((entries.reduce((sum, entry) => sum + entry.stress, 0) / entries.length) * 10) / 10;
  const shortSleepDays = entries.filter((entry) => entry.sleepQuality <= 4).length;
  const highAqiDays = entries.filter((entry) => entry.environmentContext.includes("high AQI")).length;
  const ranked = [...entries].sort((a, b) => dayScore(b) - dayScore(a));
  const bestDay = ranked[0];
  const hardestDay = ranked[ranked.length - 1];

  return {
    averageEnergy,
    averageStress,
    shortSleepDays,
    highAqiDays,
    bestDay,
    hardestDay,
    takeaway: language === "th"
      ? "พลังของ Beam ตกชัดเมื่อฝุ่น นอนน้อย และงานหน้าจอหนักมาชนกัน ไม่ใช่เรื่องวินัยอย่างเดียว"
      : "Beam’s energy drops most clearly when high AQI, short sleep, and screen-heavy work land together. It is not just a discipline problem.",
    experiment: language === "th"
      ? "สัปดาห์หน้าให้ลองสองอย่างพอ: มื้อเที่ยงก่อน 12:00 และหยุดกาแฟก่อน 14:00"
      : "Next week, test only two things: lunch before noon and caffeine before 14:00."
  };
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper/80 px-2 py-2 text-center">
      <p className="text-[9px] font-black uppercase text-ink/36">{label}</p>
      <p className="text-sm font-black text-ink">{value}</p>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-1">
      {["#6fa174", "#f4c95d", "#d98870"].map((color) => (
        <span key={color} className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      ))}
    </div>
  );
}

function dayColor(entry: DailyEntry) {
  const score = dayScore(entry);
  if (score >= 88) return "#6fa174";
  if (score >= 66) return "#f4c95d";
  if (score >= 48) return "#d98870";
  return "#9b8ec4";
}

function dayScore(entry: DailyEntry) {
  return entry.energy * 8 + entry.sleepQuality * 4 + (10 - entry.stress) * 3;
}
