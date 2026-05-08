"use client";

const MOODS = ["หนัก", "ต่ำ", "พอไหว", "ดี", "ลื่น"];

export function EnergyBead({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <>
      <div className="energy-bead-track mt-4" role="group" aria-label="เลือกพลังงานวันนี้">
        {MOODS.map((label, index) => {
          const bead = index + 1;
          return (
            <button
              key={label}
              id={`mood-btn-${bead}`}
              onClick={() => onChange(bead)}
              className={`energy-bead ${value === bead ? "energy-bead-active" : ""}`}
              aria-label={`พลังงานวันนี้: ${label}`}
              style={{ background: beadColor(bead) }}
            >
              <span>{bead}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs font-bold text-ink/45">
        {value ? MOODS[value - 1] : "แตะเพื่อเลือก"}
      </p>
    </>
  );
}

function beadColor(level: number) {
  const colors = ["#c8e6f9", "#dceee2", "#f5f0df", "#ffd4b2", "#f4c95d"];
  return colors[level - 1] ?? "#dceee2";
}
