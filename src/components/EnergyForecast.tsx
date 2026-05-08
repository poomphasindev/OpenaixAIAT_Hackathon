"use client";

import { BellPlus, CalendarClock, SlidersHorizontal } from "lucide-react";
import type { EnergyForecast as EnergyForecastType, EnergyForecastSlot } from "@/lib/types";

const STATUS_STYLE: Record<EnergyForecastSlot["status"], { label: string; color: string; bg: string }> = {
  optimal: { label: "งานลึก", color: "#2f8f5b", bg: "rgba(220,238,226,0.72)" },
  stable: { label: "คงที่", color: "#45624d", bg: "rgba(255,255,255,0.74)" },
  declining: { label: "เริ่มลด", color: "#a87322", bg: "rgba(244,201,93,0.22)" },
  crash: { label: "เสี่ยงหมดแรง", color: "#b84a36", bg: "rgba(217,136,112,0.18)" },
  recovery: { label: "ฟื้นตัว", color: "#6a5fa0", bg: "rgba(232,213,245,0.32)" }
};

export function EnergyForecast({ forecast }: { forecast: EnergyForecastType }) {
  return (
    <section className="app-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">คาดการณ์พลังงาน</p>
          <h3 className="text-base font-black leading-5 text-ink">เตือนก่อนพลังตกจริง</h3>
          <p className="mt-1 text-xs font-bold leading-5 text-ink/50">{forecast.summary}</p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mint text-moss">
          <CalendarClock size={18} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {forecast.timeSlots.map((slot) => {
          const style = STATUS_STYLE[slot.status];
          return (
            <div key={slot.time} className="forecast-row">
              <span className="w-11 text-xs font-black text-ink/48">{slot.time}</span>
              <span className="forecast-dot" style={{ background: style.color }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-black text-ink">{slot.recommendation}</p>
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-black" style={{ color: style.color, background: style.bg }}>
                    {slot.confidence}%
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: style.color }}>{style.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="rounded-2xl bg-ink px-3 py-2.5 text-xs font-black text-white">
          <span className="inline-flex items-center gap-1.5"><BellPlus size={13} />ตั้งเตือน</span>
        </button>
        <button className="rounded-2xl bg-white px-3 py-2.5 text-xs font-black text-ink/62 shadow-sm">
          <span className="inline-flex items-center gap-1.5"><SlidersHorizontal size={13} />ปรับแผน</span>
        </button>
      </div>
    </section>
  );
}
