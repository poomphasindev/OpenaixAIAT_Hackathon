"use client";

import { CloudFog, HelpCircle, Send, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";
import { MascotLuma } from "@/components/MascotLuma";
import { scenarios, todayContext } from "@/data/seed";
import type { Recommendation } from "@/lib/types";

const QUICK_REPLIES = [
  { id: "easier", label: "ทำให้ง่ายลง", icon: SlidersHorizontal },
  { id: "why", label: "ทำไมแผนนี้", icon: HelpCircle },
  { id: "cant", label: "วันนี้ทำไม่ได้", icon: ShieldCheck },
  { id: "aqi", label: "วางแผนตาม AQI", icon: CloudFog, scenarioId: "aqi" }
];

export function CoachScreen({
  checkin, recommendation, onCheckin, onSubmit, onScenario
}: {
  checkin: string;
  recommendation: Recommendation;
  onCheckin: (v: string) => void;
  onSubmit: () => void;
  onScenario: (text: string) => void;
}) {
  const [inputVal, setInputVal] = useState(checkin);
  const [showWhy, setShowWhy] = useState(false);
  const crisis = recommendation.safetyState === "crisis";

  function handleSend() {
    onCheckin(inputVal);
    onSubmit();
  }

  function handleQuickReply(reply: typeof QUICK_REPLIES[number]) {
    if (reply.scenarioId) {
      const scenario = scenarios.find((item) => item.id === reply.scenarioId);
      if (scenario) {
        setInputVal(scenario.checkin);
        onScenario(scenario.checkin);
      }
      return;
    }
    if (reply.id === "why") {
      setShowWhy((value) => !value);
      return;
    }
    setInputVal(reply.label);
  }

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      <header className="pt-1">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">โค้ชส่วนตัว</p>
        <h2 className="text-2xl font-black text-ink">มุมมองของ Luma</h2>
      </header>

      <section className="app-panel">
        <div className="grid grid-cols-[96px_1fr] items-center gap-3">
          <div className="-my-8 -ml-3 scale-[0.62]">
            <MascotLuma mood={crisis ? "alert" : "concerned"} compact />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">
              {crisis ? "โหมดความปลอดภัย" : "สถานะ pattern"}
            </p>
            <p className="mt-1 text-sm font-black leading-5 text-ink">
              {crisis
                ? "Luma หยุด coaching ปกติก่อน เพราะความปลอดภัยต้องมาก่อน"
                : `Luma กำลังดู AQI ใน ${todayContext.location}, การนอนน้อย และงานหน้าจอหนักของวันนี้`}
            </p>
          </div>
        </div>
      </section>

      {crisis && (
        <section className="rounded-2xl border border-coral/25 bg-coral/10 p-4">
          <p className="text-sm font-black text-coral">เปิดโหมดความปลอดภัย</p>
          <p className="mt-1 text-xs leading-5 text-ink/70">
            ถ้าคุณหรือคนใกล้ตัวอยู่ในอันตราย โปรดติดต่อบริการฉุกเฉินหรือคนที่ไว้ใจทันที ในไทยมีสายด่วนสุขภาพจิต 1323 และสมาคมสะมาริตันส์ 02-713-6793
          </p>
        </section>
      )}

      <section className={`coach-plan-card ${crisis ? "coach-plan-alert" : ""}`}>
        <div className="flex items-center gap-2">
          <div className={`grid h-9 w-9 place-items-center rounded-2xl text-white ${crisis ? "bg-coral" : "bg-ink"}`}>
            {crisis ? <ShieldCheck size={17} /> : <Sparkles size={17} />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{crisis ? "ปลอดภัยก่อน" : "แผนวันนี้"}</p>
            <p className="text-xs font-bold text-ink/45">สั้น ชัด และปรับได้</p>
          </div>
        </div>

        <p className="mt-4 text-lg font-black leading-6 text-ink">{recommendation.summary}</p>

        <div className="mt-4 space-y-2">
          <div className="rounded-2xl bg-mint/70 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase text-moss">แผนหลัก</p>
            <p className="mt-0.5 text-sm font-semibold leading-5 text-ink">{recommendation.primaryAction}</p>
          </div>
          <div className="rounded-2xl bg-sky-50 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase text-moss">แผนสำรอง</p>
            <p className="mt-0.5 text-sm font-semibold leading-5 text-ink/74">{recommendation.backupAction}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {recommendation.whySignals.slice(0, 3).map((signal) => (
            <span key={signal} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-ink/58 shadow-sm">
              {signal}
            </span>
          ))}
        </div>

        {showWhy && (
          <div className="mt-3 rounded-2xl border border-moss/10 bg-white/72 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-moss">เหตุผลของแผนนี้</p>
            <div className="mt-2 space-y-1.5">
              {[
                "5 พ.ค.: AQI สูงตรงกับวันที่ข้าม movement",
                "6 พ.ค.: นอนน้อย + กาแฟ ตามด้วยพลังต่ำ",
                "วันนี้: AQI 145, นอน 5 ชม., งาน 8/10"
              ].map((item) => (
                <p key={item} className="rounded-xl bg-mint/45 px-3 py-2 text-[10px] font-bold leading-4 text-ink/60">{item}</p>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="app-panel">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-moss">ตอบเร็ว</p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {QUICK_REPLIES.map((reply) => {
            const Icon = reply.icon;
            return (
              <button key={reply.id} className="quick-chip" onClick={() => handleQuickReply(reply)}>
                <span className="inline-flex items-center gap-1.5">
                  <Icon size={13} />
                  {reply.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-[22px] border border-white/70 bg-paper/80 p-2">
          <input
            id="coach-input"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-ink/35"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="บอก Luma ให้ปรับแผน"
            aria-label="ข้อความถึงโค้ช"
          />
          <button
            id="coach-send-btn"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white"
            onClick={handleSend}
            aria-label="ส่งข้อความ"
          >
            <Send size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
