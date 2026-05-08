"use client";

import { BriefcaseBusiness, CalendarPlus, Footprints, Soup, TrainFront, UsersRound } from "lucide-react";
import type { CalendarEvent } from "@/lib/types";

const EVENT_ICON: Record<CalendarEvent["type"], typeof BriefcaseBusiness> = {
  work: BriefcaseBusiness,
  social: UsersRound,
  exercise: Footprints,
  meal: Soup,
  commute: TrainFront,
  deadline: BriefcaseBusiness
};

const IMPACT_STYLE: Record<CalendarEvent["energyImpact"], { label: string; bg: string; color: string }> = {
  high: { label: "ใช้พลังสูง", bg: "#fff2f0", color: "#9a4d38" },
  medium: { label: "ปานกลาง", bg: "#fff8e8", color: "#8a681d" },
  low: { label: "เบา", bg: "#f8faf8", color: "#45624d" },
  recovery: { label: "ฟื้นตัว", bg: "#edf7ed", color: "#3d6c42" }
};

function timeLabel(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function TodayRhythm({ events, onAdd }: { events: CalendarEvent[]; onAdd: () => void }) {
  return (
    <section className="app-panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">จังหวะวันนี้</p>
          <h3 className="text-base font-black text-ink">จำลองจาก calendar</h3>
        </div>
        <button onClick={onAdd} className="grid h-9 w-9 place-items-center rounded-2xl bg-mint text-moss" aria-label="เพิ่มรายการเอง">
          <CalendarPlus size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {events.map((event) => {
          const Icon = EVENT_ICON[event.type];
          const impact = IMPACT_STYLE[event.energyImpact];
          return (
            <article key={event.id} className="rhythm-event">
              <span className="w-11 shrink-0 text-xs font-black text-ink/48">{timeLabel(event.startTime)}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl" style={{ background: impact.bg, color: impact.color }}>
                <Icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-black leading-5 text-ink">{event.title}</p>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black" style={{ background: impact.bg, color: impact.color }}>
                    {impact.label}
                  </span>
                </div>
                {event.lumaNote && <p className="mt-0.5 text-xs font-semibold leading-4 text-ink/54">{event.lumaNote}</p>}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="rounded-2xl bg-white px-3 py-2.5 text-xs font-black text-ink/62 shadow-sm">ตั้งค่าซิงก์</button>
        <button className="rounded-2xl bg-ink px-3 py-2.5 text-xs font-black text-white">เพิ่มเอง</button>
      </div>
    </section>
  );
}
