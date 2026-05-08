"use client";

import { BellRing, CheckCircle2, ClipboardList, Code2, KeyRound, ListChecks, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { DebugControls, type DebugActionId } from "@/components/DebugControls";
import type { AiDecisionLog, DemoNotification, Language, PitchPoint } from "@/lib/types";

type JudgeTab = "notifications" | "debug" | "ai-log" | "pitch";

const PANEL_COPY: Record<Language, {
  tabs: Record<JudgeTab, string>;
  eyebrow: string;
  title: string;
  intro: string;
  ready: string;
  ran: (label: string) => string;
  testCases: string;
  apiStatus: string;
  apiNote: string;
}> = {
  th: {
    tabs: {
      notifications: "แจ้งเตือน",
      debug: "ทดสอบ",
      "ai-log": "เหตุผล AI",
      pitch: "Pitch"
    },
    eyebrow: "Demo Control Panel",
    title: "ทดสอบให้กรรมการเห็นทันที",
    intro: "ปุ่มด้านล่างใช้ข้อมูล mock เพื่อเปลี่ยน scenario ในมือถือจริง ส่วน API key จะใช้ตอนเปิด response จากโมเดลและข้อมูล real-time",
    ready: "พร้อมทดสอบ demo state",
    ran: (label) => `${label} ทำงานแล้วในหน้ามือถือ`,
    testCases: "Test cases",
    apiStatus: "API key status",
    apiNote: "ตอนนี้ปุ่มทดสอบใช้ mock mode ได้ทันที หลังใส่ `.env` จะเปิด real OpenAI response, AQI และ weather API"
  },
  en: {
    tabs: {
      notifications: "Notify",
      debug: "Test",
      "ai-log": "AI log",
      pitch: "Pitch"
    },
    eyebrow: "Demo Control Panel",
    title: "Judge-ready live controls",
    intro: "These controls change the phone state immediately. OpenAI chat/STT and live context run through server routes when keys are present.",
    ready: "Ready for demo test",
    ran: (label) => `${label} is now running on the phone view`,
    testCases: "Test cases",
    apiStatus: "API key status",
    apiNote: "Server routes are ready: `/api/chat` uses OpenAI responses, `/api/transcribe` uses OpenAI audio, and `/api/weather` reads OpenAQ/TMD with mock fallback."
  }
};

const TABS: Array<{ id: JudgeTab; icon: typeof BellRing }> = [
  { id: "notifications", icon: BellRing },
  { id: "debug", icon: Code2 },
  { id: "ai-log", icon: ClipboardList },
  { id: "pitch", icon: ListChecks }
];

export function JudgePanel({
  language,
  notifications,
  logs,
  checklist,
  onRunTest
}: {
  language: Language;
  notifications: DemoNotification[];
  logs: AiDecisionLog[];
  checklist: PitchPoint[];
  onRunTest?: (id: DebugActionId) => void;
}) {
  const [active, setActive] = useState<JudgeTab>("debug");
  const copy = PANEL_COPY[language];
  const [lastAction, setLastAction] = useState(copy.ready);

  useEffect(() => {
    setLastAction(copy.ready);
  }, [copy.ready]);

  function runTest(id: DebugActionId, label: string) {
    onRunTest?.(id);
    setLastAction(copy.ran(label));
  }

  return (
    <aside className="judge-panel hidden lg:flex" aria-label="Demo and test case panel">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss">{copy.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink">{copy.title}</h1>
        <p className="mt-2 text-sm leading-6 text-ink/56">
          {copy.intro}
        </p>
      </div>

      <div className="judge-tabs">
        {TABS.map(({ id, icon: Icon }) => (
          <button key={id} className={active === id ? "judge-tab judge-tab-active" : "judge-tab"} onClick={() => setActive(id)}>
            <Icon size={14} />
            {copy.tabs[id]}
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
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-moss">{copy.testCases}</p>
          <DebugControls language={language} onAction={runTest} />
          <p className="mt-3 rounded-2xl bg-mint/60 px-3 py-2 text-xs font-black text-moss">{lastAction}</p>
          <div className="mt-3 rounded-2xl border border-coral/15 bg-peach/40 px-3 py-2">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-coral">
              <KeyRound size={12} />
              {copy.apiStatus}
            </p>
            <p className="mt-1 text-xs font-bold leading-5 text-ink/58">
              {copy.apiNote}
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
