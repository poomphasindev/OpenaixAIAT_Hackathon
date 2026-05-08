"use client";

import { BellRing, CheckCircle2, ClipboardList, Code2, KeyRound, ListChecks, XCircle } from "lucide-react";
import { useState } from "react";
import { DebugControls, type DebugActionId } from "@/components/DebugControls";
import type { AiDecisionLog, DemoNotification, PitchPoint } from "@/lib/types";

type JudgeTab = "notifications" | "debug" | "ai-log" | "pitch";

const TABS: Array<{ id: JudgeTab; label: string; icon: typeof BellRing }> = [
  { id: "notifications", label: "แจ้งเตือน", icon: BellRing },
  { id: "debug", label: "ทดสอบ", icon: Code2 },
  { id: "ai-log", label: "เหตุผล AI", icon: ClipboardList },
  { id: "pitch", label: "Pitch", icon: ListChecks }
];

export function JudgePanel({
  notifications,
  logs,
  checklist,
  onRunTest
}: {
  notifications: DemoNotification[];
  logs: AiDecisionLog[];
  checklist: PitchPoint[];
  onRunTest?: (id: DebugActionId) => void;
}) {
  const [active, setActive] = useState<JudgeTab>("debug");
  const [lastAction, setLastAction] = useState("พร้อมทดสอบ demo state");

  function runTest(id: DebugActionId, label: string) {
    onRunTest?.(id);
    setLastAction(`${label} ทำงานแล้วในหน้ามือถือ`);
  }

  return (
    <aside className="judge-panel hidden lg:flex" aria-label="Demo and test case panel">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss">Demo Control Panel</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink">ทดสอบให้กรรมการเห็นทันที</h1>
        <p className="mt-2 text-sm leading-6 text-ink/56">
          ปุ่มด้านล่างใช้ข้อมูล mock เพื่อเปลี่ยน scenario ในมือถือจริง ส่วน API key จะใช้ตอนเปิด response จากโมเดลและข้อมูล real-time
        </p>
      </div>

      <div className="judge-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} className={active === id ? "judge-tab judge-tab-active" : "judge-tab"} onClick={() => setActive(id)}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {active === "notifications" && (
        <div className="space-y-2">
          {notifications.map((note) => (
            <article key={note.id} className="judge-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black text-ink/38">{note.timestamp}</p>
                  <h3 className="text-sm font-black text-ink">{note.title}</h3>
                </div>
                <span className="rounded-full bg-mint px-2 py-0.5 text-[9px] font-black uppercase text-moss">{note.type}</span>
              </div>
              <p className="mt-1 text-xs font-bold leading-5 text-ink/56">{note.body}</p>
              {note.action && <button className="mt-2 rounded-full bg-ink px-3 py-1.5 text-[10px] font-black text-white">{note.action}</button>}
            </article>
          ))}
        </div>
      )}

      {active === "debug" && (
        <div className="judge-card">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-moss">Test cases</p>
          <DebugControls onAction={runTest} />
          <p className="mt-3 rounded-2xl bg-mint/60 px-3 py-2 text-xs font-black text-moss">{lastAction}</p>
          <div className="mt-3 rounded-2xl border border-coral/15 bg-peach/40 px-3 py-2">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-coral">
              <KeyRound size={12} />
              API key status
            </p>
            <p className="mt-1 text-xs font-bold leading-5 text-ink/58">
              ตอนนี้เป็น mock mode ทั้งหมด จึงทดสอบ UX ได้ทันที หลังใส่ `.env` ค่อยเปิด real OpenAI response, AQI และ weather API
            </p>
          </div>
        </div>
      )}

      {active === "ai-log" && (
        <div className="judge-card space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="rounded-2xl bg-white/70 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-wide text-moss">{log.kind}</p>
              <p className="text-xs font-bold leading-5 text-ink/62">{log.text}</p>
            </div>
          ))}
        </div>
      )}

      {active === "pitch" && (
        <div className="judge-card space-y-2">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2">
              {item.done ? <CheckCircle2 size={15} className="text-moss" /> : <XCircle size={15} className="text-coral" />}
              <span className="text-xs font-black text-ink/68">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
