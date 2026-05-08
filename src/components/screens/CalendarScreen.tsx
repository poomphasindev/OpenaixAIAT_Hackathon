"use client";

import { BriefcaseBusiness, CalendarDays, CloudFog, Coffee, Info, UsersRound } from "lucide-react";
import { thaiContextMarkers, thaiPatternAtlas } from "@/data/seed";
import type { DailyEntry } from "@/lib/types";

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

function moodTextColor(entry: DailyEntry): string {
  const s = getWellnessScore(entry);
  if (s >= 78) return "#2a4d2e";
  if (s >= 64) return "#5a420a";
  if (s >= 50) return "#6a2a18";
  return "#5a2a40";
}

function moodSymbol(entry: DailyEntry): string {
  const s = getWellnessScore(entry);
  if (s >= 78) return "+";
  if (s >= 64) return "o";
  if (s >= 50) return "-";
  return ".";
}

function markerFor(date: string) {
  return thaiContextMarkers.find((marker) => marker.date === date);
}

function MarkerIcon({ type }: { type: string }) {
  const icons = {
    aqi: CloudFog,
    caffeine: Coffee,
    work: BriefcaseBusiness,
    social: UsersRound
  };
  const Icon = icons[type as keyof typeof icons] ?? Info;
  return <Icon size={9} />;
}

const WEEKDAYS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

export function CalendarScreen({
  entries, selectedDay, onSelectDay
}: {
  entries: DailyEntry[];
  selectedDay: DailyEntry;
  onSelectDay: (e: DailyEntry) => void;
}) {
  const score = getWellnessScore(selectedDay);
  const DAY_OFFSET = 3;
  const gridEntries: (DailyEntry | null)[] = [
    ...Array(DAY_OFFSET).fill(null),
    ...entries
  ];

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      <header className="pt-1">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">9 เม.ย. - 8 พ.ค.</p>
        <h2 className="text-2xl font-black text-ink">แผนที่พลังงาน 30 วัน</h2>
        <p className="mt-1 text-xs font-bold text-ink/45">ดูง่ายว่า วันไหนฝุ่น งาน กาแฟ หรือการนอน กระทบพลังงาน</p>
      </header>

      <section className="app-panel">
        <div className="mb-3 rounded-2xl bg-mint/55 px-3 py-2">
          <p className="text-xs font-black leading-5 text-moss">
            สีคือระดับพลังงาน ส่วนไอคอนเล็กคือเหตุการณ์ที่อาจมีผล เช่น AQI, กาแฟ, งาน หรือภาระสังคม
          </p>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="py-1 text-center text-[10px] font-black uppercase text-ink/35">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {gridEntries.map((entry, i) => {
            if (!entry) return <div key={`empty-${i}`} />;
            const day = Number(entry.date.slice(-2));
            const active = selectedDay.id === entry.id;
            const bg = moodColor(entry);
            const tc = moodTextColor(entry);
            const marker = markerFor(entry.date);
            return (
              <button
                key={entry.id}
                id={`cal-day-${entry.date}`}
                className={`calendar-day ${active ? "calendar-day-active" : ""}`}
                style={{ background: bg + (active ? "" : "99"), color: tc }}
                onClick={() => onSelectDay(entry)}
                aria-label={`${entry.date}: คะแนนพลังงาน ${getWellnessScore(entry)}`}
              >
                <span className="text-[10px] font-black leading-none">{day}</span>
                <span className="mt-0.5 grid h-3 w-3 place-items-center rounded-full bg-white/55 text-[8px] leading-none">
                  {marker ? <MarkerIcon type={marker.type} /> : moodSymbol(entry)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {[
            { color: "#6fa174", label: "ดี" },
            { color: "#f4c95d", label: "กลาง" },
            { color: "#d98870", label: "ต่ำ" },
            { color: "#b86c88", label: "พัก" }
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
              <span className="text-[10px] font-black text-ink/45">{l.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="app-panel">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{selectedDay.date}</p>
            <h3 className="text-2xl font-black text-ink">{score} คะแนน</h3>
          </div>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-black"
            style={{
              background: selectedDay.recommendationHelped ? "#dceee2" : "#ffd4b233",
              color: selectedDay.recommendationHelped ? "#3d5c41" : "#8a4a20"
            }}
          >
            {selectedDay.recommendationHelped ? "ช่วยได้" : "กำลังเรียนรู้"}
          </span>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-2">
          {[
            { label: "อารมณ์", value: selectedDay.mood },
            { label: "พลัง", value: selectedDay.energy },
            { label: "เครียด", value: selectedDay.stress }
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-white/70 bg-paper/80 p-3 text-center">
              <p className="mt-1 text-[10px] font-black uppercase text-ink/40">{label}</p>
              <p className="text-xl font-black text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/72 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-moss">ทำไมได้คะแนนนี้</p>
          <p className="mt-1 text-xs leading-5 text-ink/62">
            นอน {selectedDay.sleepQuality}/10, AQI {selectedDay.environmentContext.includes("high AQI") ? "สูง" : "ปกติ"},
            กาแฟ {selectedDay.caffeine}, ขยับ {selectedDay.movement} นาที, โหลดงาน {selectedDay.workLoad}/10
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-moss">สิ่งที่ Luma เริ่มเห็น</p>
        {thaiPatternAtlas.map((pattern) => (
          <article key={pattern.id} className="app-panel">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-ink">{pattern.title}</h3>
                <p className="mt-1 text-xs leading-5 text-ink/60">{pattern.evidence}</p>
              </div>
              <CalendarDays size={17} className="shrink-0 text-moss" />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-black text-white">ดูเหตุผล</button>
              <button className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-ink/58 shadow-sm">ไม่ใช่ฉัน</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
