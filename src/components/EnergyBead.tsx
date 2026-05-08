"use client";

import type { Language } from "@/lib/types";

const MOODS: Record<Language, string[]> = {
  th: ["หนัก", "ต่ำ", "พอไหว", "ดี", "ลื่น"],
  en: ["Heavy", "Low", "Okay", "Good", "Flow"]
};

const LABELS: Record<Language, { aria: string; empty: string }> = {
  th: {
    aria: "เลือกพลังงานวันนี้",
    empty: "แตะเพื่อเลือก"
  },
  en: {
    aria: "Choose today's energy",
    empty: "Tap to choose"
  }
};

export function EnergyBead({
  value,
  language = "th",
  onChange
}: {
  value: number;
  language?: Language;
  onChange: (next: number) => void;
}) {
  const moods = MOODS[language];
  const labels = LABELS[language];

  return (
    <>
      <div className="energy-bead-track mt-4" role="group" aria-label={labels.aria}>
        {moods.map((label, index) => {
          const bead = index + 1;
          return (
            <button
              key={label}
              id={`mood-btn-${bead}`}
              onClick={() => onChange(bead)}
              className={`energy-bead ${value === bead ? "energy-bead-active" : ""}`}
              aria-label={`${labels.aria}: ${label}`}
              style={{ background: beadColor(bead) }}
            >
              <span>{bead}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs font-bold text-ink/45">
        {value ? moods[value - 1] : labels.empty}
      </p>
    </>
  );
}

function beadColor(level: number) {
  const colors = ["#c8e6f9", "#dceee2", "#f5f0df", "#ffd4b2", "#f4c95d"];
  return colors[level - 1] ?? "#dceee2";
}
