"use client";

import { ArrowRight, Beaker, BrainCircuit, CloudFog, KeyRound, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import type { Language } from "@/lib/types";

const COPY = {
  th: {
    event: "OpenAI Codex x AIAT Thailand",
    title: "RoutineSense AI",
    subtitle: "ผู้ช่วยดูแลพลังงานประจำวันสำหรับชีวิตในกรุงเทพฯ ที่คาดการณ์ก่อนหมดแรง อธิบายเหตุผล และเก็บข้อมูลไว้กับผู้ใช้เป็นหลัก",
    conceptTitle: "ชื่อผลงาน / แนวคิด",
    pitchBullets: [
      "ผู้ช่วยดูแลพลังงานสำหรับชีวิตเมืองไทย ไม่ใช่แอพบันทึกทั่วไป",
      "ใช้ AQI, ความร้อน, การนอน, งาน และตารางชีวิตเพื่อแนะนำก่อนพลังตก",
      "Luma อธิบายเหตุผลและเรียนรู้จากคำตอบของผู้ใช้แบบโปร่งใส"
    ],
    demoTitle: "Demo flow 90 วินาที",
    demoFlow: [
      "Now: Luma รวม AQI + นอน + ตารางเป็น briefing เดียว",
      "Talk: พูดหรือพิมพ์ diary แล้วถาม Why เพื่อดูเหตุผล",
      "You: ดู memory 30 วัน, pattern, weekly letter และ privacy"
    ],
    envTitle: "Test case / .env",
    envNote: "ปุ่ม test case ตอนนี้ใช้ mock ได้เลย ยังไม่ต้องมี API key",
    safetyTitle: "ขอบเขตความปลอดภัย",
    safety: "RoutineSense เป็นผู้ช่วยดูแลสุขภาวะ ไม่ใช่แพทย์ ไม่วินิจฉัย และในโหมด demo ข้อมูลทั้งหมดอยู่ในเครื่อง",
    thaiFirst: "Thai-first: AQI, heat, commute, late-night coding",
    envItems: [
      { name: "OPENAI_API_KEY", status: "ตั้งค่าแล้ว", detail: "ใช้ตอนเปลี่ยนจาก mock rule เป็นคำตอบจาก GPT จริง" },
      { name: "OPENAQ_API_KEY", status: "ตั้งค่าแล้ว", detail: "ดึง AQI/PM2.5 จาก OpenAQ location 2178" },
      { name: "TMD_API_KEY", status: "ตั้งค่าแล้ว", detail: "ดึงอุณหภูมิ/ความชื้นจากกรมอุตุฯ" }
    ]
  },
  en: {
    event: "OpenAI Codex x AIAT Thailand",
    title: "RoutineSense AI",
    subtitle: "A Thai-first daily energy companion for Bangkok life. It predicts friction before energy drops, explains why, and keeps user-owned data local.",
    conceptTitle: "Project / Concept",
    pitchBullets: [
      "A daily energy copilot for Thai city life, not another passive tracker",
      "Fuses AQI, heat, sleep, workload, and schedule before the crash happens",
      "Luma explains reasoning and learns from user feedback transparently"
    ],
    demoTitle: "90-second demo flow",
    demoFlow: [
      "Now: Luma fuses AQI, sleep, and schedule into one briefing",
      "Talk: speak or type a diary entry, then ask Why for reasoning",
      "You: review 30-day memory, patterns, weekly letter, and privacy"
    ],
    envTitle: "Test cases / .env",
    envNote: "Test cases work offline; server routes use live APIs when keys are present.",
    safetyTitle: "Safety Scope",
    safety: "RoutineSense is a wellness companion, not a doctor, diagnosis, or crisis service. Demo data stays local.",
    thaiFirst: "Thai-first: AQI, heat, commute, late-night coding",
    envItems: [
      { name: "OPENAI_API_KEY", status: "active", detail: "Used for Luma chat responses and speech-to-text" },
      { name: "OPENAQ_API_KEY", status: "set", detail: "Fetches AQI/PM2.5 from OpenAQ location 2178" },
      { name: "TMD_API_KEY", status: "set", detail: "Fetches weather from Thai Meteorological Department" }
    ]
  }
};

export function ProjectBriefPanel({ language }: { language: Language }) {
  const copy = COPY[language];
  return (
    <aside className="project-brief-panel hidden lg:flex" aria-label="Project brief">
      <section className="project-hero-copy">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-moss shadow-sm">
          <MapPin size={13} />
          {copy.event}
        </div>
        <h1 className="mt-4 text-4xl font-black leading-[1.02] text-ink">
          {copy.title}
        </h1>
        <p className="mt-3 text-sm font-bold leading-6 text-ink/62">
          {copy.subtitle}
        </p>
      </section>

      <section className="brief-card">
        <div className="brief-card-title">
          <BrainCircuit size={16} />
          <span>{copy.conceptTitle}</span>
        </div>
        <ul className="mt-3 space-y-2">
          {copy.pitchBullets.map((item) => (
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
          <span>{copy.demoTitle}</span>
        </div>
        <ol className="mt-3 space-y-2">
          {copy.demoFlow.map((item, index) => (
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
          <span>{copy.envTitle}</span>
        </div>
        <div className="mt-3 rounded-2xl bg-mint/55 px-3 py-2 text-xs font-black leading-5 text-moss">
          {copy.envNote}
        </div>
        <div className="mt-3 space-y-2">
          {copy.envItems.map((item) => (
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
          <span>{copy.safetyTitle}</span>
        </div>
        <p className="mt-2 text-xs font-bold leading-5 text-ink/58">
          {copy.safety}
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 text-xs font-black text-coral">
          <CloudFog size={14} />
          {copy.thaiFirst}
        </div>
      </section>
    </aside>
  );
}
