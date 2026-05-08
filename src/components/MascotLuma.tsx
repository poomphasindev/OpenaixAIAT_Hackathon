"use client";

import type { LumaMood } from "@/lib/types";

const PARTICLES: { size: number; top: string; left: string; delay: string; color: string }[] = [
  { size: 8,  top: "8%",  left: "20%", delay: "0s",    color: "rgba(244,201,93,0.75)" },
  { size: 6,  top: "18%", left: "72%", delay: "0.6s",  color: "rgba(111,161,116,0.7)" },
  { size: 5,  top: "62%", left: "14%", delay: "1.2s",  color: "rgba(255,212,178,0.8)" },
  { size: 7,  top: "72%", left: "80%", delay: "0.3s",  color: "rgba(232,213,245,0.8)" },
  { size: 4,  top: "38%", left: "88%", delay: "0.9s",  color: "rgba(200,230,249,0.8)" }
];

const CHIP_MAP: Record<LumaMood, [string, string]> = {
  calm:     ["food first", "no 3pm crash"],
  happy:    ["great rhythm", "keep it up"],
  alert:    ["you matter", "reach out now"],
  thinking: ["learning", "7-day memory"],
  concerned: ["AQI rough", "small plan"],
  celebrating: ["15-day streak", "pattern found"],
  sleepy: ["wind down", "screen off"],
  anxious: ["lighter load", "one block"],
  proud: ["you did it", "Luma noticed"],
  confused: ["needs feedback", "your call"]
};

export function MascotLuma({ mood = "calm", compact = false }: { mood?: LumaMood; compact?: boolean }) {
  const bodyClass =
    mood === "alert" || mood === "concerned" || mood === "anxious" ? "luma luma-alert luma-mood-concerned" :
    mood === "happy" || mood === "proud" ? "luma luma-happy luma-mood-happy" :
    mood === "celebrating" ? "luma luma-happy luma-mood-celebrating" :
    mood === "sleepy" || mood === "thinking" || mood === "confused" ? "luma luma-thinking luma-mood-sleepy" :
    "luma";

  const glowClass =
    mood === "alert" || mood === "concerned" || mood === "anxious" ? "luma-glow luma-glow-alert" :
    mood === "thinking" || mood === "sleepy" || mood === "confused" ? "luma-glow luma-glow-thinking" :
    "luma-glow";

  const positive = mood === "happy" || mood === "celebrating" || mood === "proud";
  const eyeClass = positive ? "luma-eye luma-eye-happy" : mood === "sleepy" ? "luma-eye luma-eye-sleepy" : "luma-eye";
  const mouthClass = positive ? "luma-mouth luma-mouth-happy" : mood === "concerned" || mood === "anxious" ? "luma-mouth luma-mouth-concerned" : "luma-mouth";

  const [chipA, chipB] = CHIP_MAP[mood];

  return (
    <div className={compact ? "mascot-stage mascot-stage-compact" : "mascot-stage"} aria-label="Luma, RoutineSense mascot">
      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="luma-particle"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            background: p.color,
            animationDuration: `${2.8 + i * 0.4}s`
          }}
        />
      ))}

      {/* Orbits */}
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />

      {/* Body */}
      <div className={bodyClass}>
        <div className={glowClass} />
        <div className="luma-face">
          <span className={eyeClass} />
          <span className={eyeClass} />
        </div>
        <div className={mouthClass} />
      </div>

      {/* Floating chips */}
      <div className="float-chip chip-one">{chipA}</div>
      <div className="float-chip chip-two">{chipB}</div>

      {positive && (
        <div className="float-chip chip-three" aria-hidden="true">+</div>
      )}
    </div>
  );
}
