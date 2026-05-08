"use client";

import { ArrowRight, Beaker, BrainCircuit, CloudFog, KeyRound, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const pitchBullets = [
  "ผู้ช่วยดูแลพลังงานสำหรับชีวิตเมืองไทย ไม่ใช่แอพบันทึกทั่วไป",
  "ใช้ AQI, ความร้อน, การนอน, งาน และตารางชีวิตเพื่อแนะนำก่อนพลังตก",
  "Luma อธิบายเหตุผลและเรียนรู้จากคำตอบของผู้ใช้แบบโปร่งใส"
];

const demoFlow = [
  "เปิดหน้าแรก: เห็น AQI กรุงเทพฯ + แผนวันนี้ทันที",
  "เช็คอิน: เลือกพลัง 1-5 แล้วให้ Luma สร้างแผน",
  "หน้าเดือน/อินไซต์: ดู pattern 30 วันและกดบอกว่าแม่นหรือไม่"
];

const envItems = [
  { name: "OPENAI_API_KEY", status: "ยังไม่ใส่", detail: "ใช้ตอนเปลี่ยนจาก mock rule เป็นคำตอบจาก GPT จริง" },
  { name: "OPENAQ_API_KEY", status: "ภายหลัง", detail: "ถ้าใช้ AQI real-time แทนข้อมูล mock" },
  { name: "WEATHER_API_KEY", status: "ภายหลัง", detail: "ถ้าดึง heat index / humidity จริง" }
];

export function ProjectBriefPanel() {
  return (
    <aside className="project-brief-panel hidden lg:flex" aria-label="Project brief">
      <section className="project-hero-copy">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-moss shadow-sm">
          <MapPin size={13} />
          OpenAI Codex x AIAT Thailand
        </div>
        <h1 className="mt-4 text-4xl font-black leading-[1.02] text-ink">
          RoutineSense AI
        </h1>
        <p className="mt-3 text-sm font-bold leading-6 text-ink/62">
          ผู้ช่วยดูแลพลังงานประจำวันสำหรับชีวิตในกรุงเทพฯ ที่คาดการณ์ก่อนหมดแรง อธิบายเหตุผล และเก็บข้อมูลไว้กับผู้ใช้เป็นหลัก
        </p>
      </section>

      <section className="brief-card">
        <div className="brief-card-title">
          <BrainCircuit size={16} />
          <span>ชื่อผลงาน / แนวคิด</span>
        </div>
        <ul className="mt-3 space-y-2">
          {pitchBullets.map((item) => (
            <li key={item} className="flex gap-2 text-xs font-bold leading-5 text-ink/62">
              <Sparkles size={13} className="mt-0.5 shrink-0 text-coral" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="brief-card">
        <div className="brief-card-title">
          <ArrowRight size={16} />
          <span>Demo flow 90 วินาที</span>
        </div>
        <ol className="mt-3 space-y-2">
          {demoFlow.map((item, index) => (
            <li key={item} className="grid grid-cols-[22px_1fr] gap-2 text-xs font-bold leading-5 text-ink/62">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-white">{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="brief-card">
        <div className="brief-card-title">
          <Beaker size={16} />
          <span>Test case / .env</span>
        </div>
        <div className="mt-3 rounded-2xl bg-mint/55 px-3 py-2 text-xs font-black leading-5 text-moss">
          ปุ่ม test case ตอนนี้ใช้ mock ได้เลย ยังไม่ต้องมี API key
        </div>
        <div className="mt-3 space-y-2">
          {envItems.map((item) => (
            <div key={item.name} className="rounded-2xl bg-white/72 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex min-w-0 items-center gap-1.5 text-[10px] font-black text-ink">
                  <KeyRound size={12} className="shrink-0 text-moss" />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="shrink-0 rounded-full bg-peach px-2 py-0.5 text-[9px] font-black text-coral">{item.status}</span>
              </div>
              <p className="mt-1 text-[10px] font-bold leading-4 text-ink/50">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="brief-card brief-card-quiet">
        <div className="brief-card-title">
          <ShieldCheck size={16} />
          <span>ขอบเขตความปลอดภัย</span>
        </div>
        <p className="mt-2 text-xs font-bold leading-5 text-ink/58">
          RoutineSense เป็นผู้ช่วยดูแลสุขภาวะ ไม่ใช่แพทย์ ไม่วินิจฉัย และในโหมด demo ข้อมูลทั้งหมดอยู่ในเครื่อง
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 text-xs font-black text-coral">
          <CloudFog size={14} />
          Thai-first: AQI, heat, commute, late-night coding
        </div>
      </section>
    </aside>
  );
}
