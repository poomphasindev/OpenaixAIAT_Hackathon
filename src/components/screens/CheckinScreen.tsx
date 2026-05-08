"use client";

import { BatteryLow, Bed, Brain, BriefcaseBusiness, CloudFog, Coffee, Focus, Leaf, Mic, ShieldCheck, UsersRound, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { EnergyBead } from "@/components/EnergyBead";
import { scenarios } from "@/data/seed";
import type { Language } from "@/lib/types";

const SCENARIO_ICON = {
  aqi: CloudFog,
  caffeine: Coffee,
  overload: BriefcaseBusiness,
  balanced: Leaf,
  crisis: ShieldCheck
};

const MODES = [
  { id: "energy", label: "พลัง", icon: Zap },
  { id: "stress", label: "เครียด", icon: Brain },
  { id: "sleep", label: "นอน", icon: Bed },
  { id: "focus", label: "โฟกัส", icon: Focus },
  { id: "social", label: "สังคม", icon: UsersRound }
];

const PLACEHOLDERS = [
  "วันนี้เจออะไรที่กินพลังที่สุด?",
  "วันนี้อยากให้ Luma วางแผนรอบอะไร: ฝุ่น การนอน ความร้อน หรืองาน?",
  "เล่าแบบสั้น ๆ ก็ได้ Luma จะช่วยจับ pattern ให้"
];

const CHECKIN_COPY = {
  th: {
    kicker: "เช็คอินอัจฉริยะ",
    title: "วันนี้ร่างกายเป็นยังไง",
    bead: "เม็ดพลังงาน",
    beadHelp: "เลือกความรู้สึก ไม่ใช่กรอกฟอร์มแพทย์",
    tell: "เล่าให้ Luma ฟัง",
    submit: "สร้างแผนวันนี้",
    scenarios: "สถานการณ์ demo"
  },
  en: {
    kicker: "smart check-in",
    title: "How is today landing?",
    bead: "Energy bead",
    beadHelp: "Pick a feeling, not a clinical form",
    tell: "Tell Luma what changed",
    submit: "Build my day",
    scenarios: "Demo scenarios"
  }
};

const SCENARIO_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  aqi:      { bg: "#e8f3f8", border: "#c8e6f9", text: "#2a5f7a" },
  caffeine: { bg: "#fff8e8", border: "#f4c95d55", text: "#7a5b20" },
  overload: { bg: "#f5eeff", border: "#d4ccf055", text: "#5a4a90" },
  balanced: { bg: "#edf7ed", border: "#dceee2", text: "#3d5c41" },
  crisis:   { bg: "#fff2f0", border: "#d9887055", text: "#8a3a2a" }
};

export function CheckinScreen({
  checkin, moodRating, voiceActive, language, onMood, onCheckin, onSubmit, onVoice, onScenario
}: {
  checkin: string;
  moodRating: number;
  voiceActive: boolean;
  language: Language;
  onMood: (r: number) => void;
  onCheckin: (v: string) => void;
  onSubmit: () => void;
  onVoice: () => void;
  onScenario: (text: string) => void;
}) {
  const [mode, setMode] = useState("energy");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const copy = CHECKIN_COPY[language];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((value) => (value + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      {/* Header */}
      <header className="pt-1">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">{copy.kicker}</p>
        <h2 className="text-2xl font-black text-ink leading-tight">{copy.title}</h2>
      </header>

      {/* Energy bead */}
      <section className="app-panel">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.bead}</p>
            <p className="text-xs font-bold text-ink/45">{copy.beadHelp}</p>
          </div>
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-black text-white">{moodRating}/5</span>
        </div>
        <EnergyBead value={moodRating} language={language} onChange={onMood} />

        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`mode-pill ${mode === id ? "mode-pill-active" : ""}`}
              onClick={() => setMode(id)}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Diary input */}
      <section className="app-panel space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.tell}</p>
        <div className="rounded-[22px] bg-paper/80 p-3 border border-white/70">
          <textarea
            id="checkin-textarea"
            className="min-h-32 w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-ink outline-none placeholder:text-ink/35"
            value={checkin}
            onChange={(e) => onCheckin(e.target.value)}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            aria-label="บันทึกเช็คอินประจำวัน"
          />
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <button
            id="mic-btn"
            className={`mic-button ${voiceActive ? "mic-button-active" : ""}`}
            onClick={onVoice}
            aria-label={voiceActive ? "หยุดบันทึกเสียง" : "กดเพื่อพูด"}
          >
            {voiceActive ? (
              <div className="flex items-end gap-0.5 h-5">
                {[1, 2, 3, 4, 3].map((h, i) => (
                  <span
                    key={i}
                    className="wave-bar"
                    style={{
                      height: `${h * 4}px`,
                      animationDelay: `${i * 0.12}s`
                    }}
                  />
                ))}
              </div>
            ) : (
              <Mic size={22} />
            )}
          </button>
          <button
            id="submit-checkin-btn"
            className="rounded-[22px] bg-ink px-5 py-3.5 text-sm font-black text-white transition-transform active:scale-95"
            onClick={onSubmit}
          >
            {copy.submit}
          </button>
        </div>
      </section>

      {/* Demo scenarios */}
      <section className="app-panel">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss mb-3">{copy.scenarios}</p>
        <div className="grid grid-cols-2 gap-2">
          {scenarios.map((s) => {
            const st = SCENARIO_STYLE[s.id] ?? { bg: "#f8f8f8", border: "#eee", text: "#333" };
            const Icon = SCENARIO_ICON[s.id as keyof typeof SCENARIO_ICON] ?? BatteryLow;
            return (
              <button
                key={s.id}
                id={`scenario-${s.id}`}
                className="scenario-button"
                style={{ background: st.bg, borderColor: st.border, color: st.text }}
                onClick={() => onScenario(s.checkin)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Icon size={14} />
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
