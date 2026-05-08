"use client";

import { BriefcaseBusiness, Check, Coffee, Footprints, Moon, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { PatternMemory } from "@/lib/types";

const PATTERN_STYLE: Record<
  string,
  { icon: typeof Moon; color: string; accent: string; bg: string }
> = {
  "sleep-energy":    { icon: Moon, color: "#6fa174", accent: "#dceee2", bg: "rgba(220,238,226,0.4)" },
  "caffeine-loop":   { icon: Coffee, color: "#d98870", accent: "#ffd4b2", bg: "rgba(255,212,178,0.35)" },
  "workload-carryover": { icon: BriefcaseBusiness, color: "#9b8ec4", accent: "#e8d5f5", bg: "rgba(232,213,245,0.35)" },
  "movement-buffer": { icon: Footprints, color: "#45b5c4", accent: "#c8e6f9", bg: "rgba(200,230,249,0.4)" }
};

const CONFIDENCE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  high:   { label: "มั่นใจสูง",   color: "#45624d", bg: "#dceee2" },
  medium: { label: "กลาง",    color: "#7a5b30", bg: "#f4c95d33" },
  low:    { label: "เริ่มเห็น",  color: "#7a4a40", bg: "#ffd4b233" }
};

export function PatternCard({
  pattern,
  basedOn = [],
  onDecision
}: {
  pattern: PatternMemory;
  basedOn?: string[];
  onDecision?: (decision: "confirmed" | "dismissed") => void;
}) {
  const [decision, setDecision] = useState<"idle" | "confirmed" | "dismissed">("idle");
  const [showTrail, setShowTrail] = useState(false);
  const style = PATTERN_STYLE[pattern.id] ?? {
    icon: Sparkles,
    color: "#6fa174",
    accent: "#dceee2",
    bg: "rgba(220,238,226,0.4)"
  };
  const conf = CONFIDENCE_STYLE[pattern.confidence] ?? CONFIDENCE_STYLE.low;
  const Icon = style.icon;

  return (
    <article
      className="pattern-card"
      style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.88), ${style.bg})`,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          borderRadius: "4px 0 0 4px",
          background: style.color
        }}
      />

      <div className="ml-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl" style={{ background: style.accent, color: style.color }}>
              <Icon size={16} />
            </span>
            <h3 className="text-sm font-black leading-tight text-ink">{pattern.label}</h3>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black"
            style={{ background: conf.bg, color: conf.color }}
          >
            {conf.label}
          </span>
        </div>

        {/* Evidence */}
        <p className="text-xs leading-5 text-ink/65 mb-3">{pattern.evidence}</p>

        {basedOn.length > 0 && (
          <button
            className="mb-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-ink/58 shadow-sm"
            onClick={() => setShowTrail((value) => !value)}
          >
            {showTrail ? "ซ่อนวันที่ใช้เทียบ" : "อิงจากวันเหล่านี้"}
          </button>
        )}

        {showTrail && (
          <div className="mb-3 grid gap-1.5">
            {basedOn.map((item) => (
              <div key={item} className="rounded-xl bg-white/70 px-3 py-2 text-[10px] font-bold text-ink/58">
                {item}
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] italic text-ink/40 mb-3">เป็น pattern ระยะแรก ยังไม่ใช่ข้อสรุป คุณรู้สึกว่าตรงไหม</p>

        {/* Confirm button */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDecision("confirmed");
              onDecision?.("confirmed");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition-all duration-200 ${
              decision === "confirmed" ? "text-white" : "text-ink/70"
            }`}
            style={{
              background: decision === "confirmed" ? style.color : "rgba(255,255,255,0.9)",
              boxShadow: decision === "confirmed" ? `0 4px 14px ${style.color}44` : "0 2px 8px rgba(23,32,29,0.08)"
            }}
          >
            <Check size={11} />
            {decision === "confirmed" ? "ยืนยันแล้ว" : "ตรงนะ"}
          </button>
          <button
            onClick={() => {
              setDecision("dismissed");
              onDecision?.("dismissed");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition-all duration-200 ${
              decision === "dismissed" ? "bg-coral text-white" : "bg-white text-ink/58"
            }`}
          >
            <X size={11} />
            ไม่ตรง
          </button>
        </div>
      </div>
    </article>
  );
}
