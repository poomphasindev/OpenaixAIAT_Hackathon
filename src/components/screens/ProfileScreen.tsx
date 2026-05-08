"use client";

import { ArrowLeft, Download, Lock, Mic, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { demoUser } from "@/data/seed";
import type { Language } from "@/lib/types";

interface ToggleRowProps {
  label: string;
  value: string;
  on?: boolean;
}

function ToggleRow({ label, value, on = true }: ToggleRowProps) {
  const [active, setActive] = useState(on);
  const isToggle = value !== "ไม่เลย" && value !== "Never" && value !== "แตะเพื่อล้าง";
  const isNever = value === "ไม่เลย" || value === "Never";
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-ink/5 last:border-0">
      <span className="text-sm font-bold text-ink">{label}</span>
      {isToggle ? (
        <button
          onClick={() => setActive((v) => !v)}
          className="relative h-6 w-11 rounded-full transition-colors duration-200"
          style={{ background: active ? "#6fa174" : "rgba(23,32,29,0.14)" }}
          aria-label={`${label}: ${active ? "on" : "off"}`}
        >
          <span
            className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
            style={{ transform: active ? "translateX(20px)" : "translateX(0)" }}
          />
        </button>
      ) : (
        <span
          className="rounded-full px-3 py-1 text-xs font-black"
          style={{
            background: isNever ? "#ffd4b233" : "#dceee2",
            color:      isNever ? "#8a3a1a"  : "#3d5c41"
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

const PROFILE_COPY = {
  th: {
    back: "กลับ",
    kicker: "โปรไฟล์และความเป็นส่วนตัว",
    language: "ภาษา",
    used: "ใช้มา",
    days: "วัน",
    stats: [
      { label: "ต่อเนื่อง", value: `${demoUser.streak} วัน` },
      { label: "เป้าหมาย", value: "พลังงาน" },
      { label: "อายุ", value: String(demoUser.age) }
    ],
    privacyTitle: "ความเป็นส่วนตัวตั้งแต่แรก",
    demoBadge: "โหมด demo: ข้อมูลทั้งหมดอยู่ในเครื่องนี้",
    toggles: [
      { label: "เก็บ journal ดิบไว้ในเครื่อง", value: "เปิด", on: true },
      { label: "แจ้งชัดเมื่อใช้ AI voice", value: "เปิด", on: true },
      { label: "ขายหรือแชร์ข้อมูล wellness", value: "ไม่เลย", on: false }
    ],
    safetyTitle: "ขอบเขตความปลอดภัย",
    safetyText: "RoutineSense AI เป็น wellness copilot ไม่ใช่การวินิจฉัยทางการแพทย์ การบำบัด หรือบริการฉุกเฉิน หากคุณอยู่ในอันตราย โปรดติดต่อบริการฉุกเฉินหรือคนที่ไว้ใจทันที",
    crisisLine: "ไทย: สายด่วนสุขภาพจิต 1323 และสมาคมสะมาริตันส์ 02-713-6793",
    voiceTitle: "การใช้เสียงกับ AI",
    voiceText: "การเช็คอินด้วยเสียงจะถูกแปลงเป็นข้อความด้วย AI ใน demo นี้ไม่เก็บเสียงดิบ และเก็บ tag ที่สรุปไว้เฉพาะในเครื่อง",
    export: "Export ข้อมูล wellness ของฉัน",
    clear: "ล้างข้อมูลทั้งหมด",
    cleared: "ล้างข้อมูลแล้ว"
  },
  en: {
    back: "Back",
    kicker: "Profile and privacy",
    language: "Language",
    used: "using for",
    days: "days",
    stats: [
      { label: "Streak", value: `${demoUser.streak} days` },
      { label: "Goal", value: "Energy" },
      { label: "Age", value: String(demoUser.age) }
    ],
    privacyTitle: "Privacy from day one",
    demoBadge: "Demo mode: all data stays on this device",
    toggles: [
      { label: "Keep raw journal locally", value: "On", on: true },
      { label: "Disclose when AI voice is used", value: "On", on: true },
      { label: "Sell or share wellness data", value: "Never", on: false }
    ],
    safetyTitle: "Safety boundary",
    safetyText: "RoutineSense AI is a wellness copilot, not medical diagnosis, therapy, or an emergency service. If you are in danger, contact emergency services or someone you trust immediately.",
    crisisLine: "Thailand: Mental Health Hotline 1323 and Samaritans 02-713-6793",
    voiceTitle: "Voice with AI",
    voiceText: "Voice check-ins are transcribed with AI. This demo does not store raw audio and keeps summary tags locally.",
    export: "Export my wellness memory",
    clear: "Clear all data",
    cleared: "Data cleared"
  }
} satisfies Record<Language, {
  back: string;
  kicker: string;
  language: string;
  used: string;
  days: string;
  stats: Array<{ label: string; value: string }>;
  privacyTitle: string;
  demoBadge: string;
  toggles: Array<{ label: string; value: string; on: boolean }>;
  safetyTitle: string;
  safetyText: string;
  crisisLine: string;
  voiceTitle: string;
  voiceText: string;
  export: string;
  clear: string;
  cleared: string;
}>;

export function ProfileScreen({
  language,
  onLanguage,
  onBack
}: {
  language: Language;
  onLanguage: (language: Language) => void;
  onBack: () => void;
}) {
  const [cleared, setCleared] = useState(false);
  const copy = PROFILE_COPY[language];

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      {/* Back */}
      <div className="pt-1 flex items-center gap-3">
        <button
          id="profile-back-btn"
          onClick={onBack}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-ink shadow-sm"
          aria-label={copy.back}
        >
          <ArrowLeft size={17} />
        </button>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">{copy.kicker}</p>
      </div>

      <section className="app-panel">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.language}</p>
        <div className="grid grid-cols-2 gap-2">
          <button className={`language-toggle ${language === "en" ? "language-toggle-active" : ""}`} onClick={() => onLanguage("en")}>
            English
          </button>
          <button className={`language-toggle ${language === "th" ? "language-toggle-active" : ""}`} onClick={() => onLanguage("th")}>
            ไทย
          </button>
        </div>
      </section>

      {/* Avatar card */}
      <section className="app-panel">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div
              className="grid h-16 w-16 place-items-center rounded-[20px] text-2xl font-black text-white"
              style={{
                background: "linear-gradient(135deg, #6fa174, #45624d)"
              }}
            >
              {demoUser.name[0]}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-ink">{demoUser.name}</h2>
            <p className="text-xs font-bold text-ink/55">{demoUser.city} · {copy.used} {demoUser.joinedDaysAgo} {copy.days}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {copy.stats.map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-paper/80 p-3 text-center border border-white/70">
              <p className="text-[10px] font-black uppercase text-ink/40">{label}</p>
              <p className="text-sm font-black text-ink mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs leading-5 text-ink/55 italic">{demoUser.persona}</p>
      </section>

      {/* Privacy */}
      <section className="app-panel">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={15} className="text-moss" />
          <h3 className="text-base font-black text-ink">{copy.privacyTitle}</h3>
        </div>
        <div className="mb-3 rounded-2xl bg-mint/55 px-3 py-2">
          <p className="text-xs font-black text-moss">{copy.demoBadge}</p>
        </div>
        {copy.toggles.map((item) => (
          <ToggleRow key={item.label} label={item.label} value={item.value} on={item.on} />
        ))}
      </section>

      {/* Safety */}
      <section className="app-panel border border-coral/20">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={15} className="text-coral" />
          <h3 className="text-base font-black text-ink">{copy.safetyTitle}</h3>
        </div>
        <p className="text-xs leading-5 text-ink/60">
          {copy.safetyText}
        </p>
        <p className="text-xs font-bold text-coral/80 mt-2">
          {copy.crisisLine}
        </p>
      </section>

      {/* AI disclosure */}
      <section className="app-panel">
        <div className="flex items-center gap-2 mb-2">
          <Mic size={15} className="text-moss" />
          <h3 className="text-base font-black text-ink">{copy.voiceTitle}</h3>
        </div>
        <p className="text-xs leading-5 text-ink/60">
          {copy.voiceText}
        </p>
      </section>

      <button
        id="export-memory-btn"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-moss/20 bg-white/75 py-3 text-sm font-black text-moss shadow-sm"
      >
        <Download size={16} />
        {copy.export}
      </button>

      {/* Clear memory */}
      <button
        id="clear-memory-btn"
        className="w-full rounded-2xl border-2 py-3 text-sm font-black transition-all duration-200"
        style={{
          borderColor: cleared ? "#6fa174" : "#d98870",
          color:       cleared ? "#3d5c41"  : "#8a3a1a",
          background:  cleared ? "#dceee2"  : "#fff2f0"
        }}
        onClick={() => setCleared(true)}
      >
        {cleared ? copy.cleared : copy.clear}
      </button>
    </div>
  );
}
