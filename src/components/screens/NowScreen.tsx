"use client";

import { Activity, ArrowRight, BrainCircuit, CalendarClock, CheckCircle2, CloudFog, Droplets, Gauge, Info, Languages, RefreshCcw, ShieldCheck, Thermometer, Zap } from "lucide-react";
import { useState } from "react";
import { EnergyBead } from "@/components/EnergyBead";
import { MascotLuma } from "@/components/MascotLuma";
import type { ContextLayer, IntelligenceOutput, Language, LumaMood } from "@/lib/types";

const COPY = {
  th: {
    now: "Now",
    greeting: "สวัสดี Beam",
    why: "ดูเหตุผล",
    hideWhy: "ซ่อนเหตุผล",
    weather: "สภาพแวดล้อม",
    energy: "พลังวันนี้",
    adjust: "ปรับ",
    rhythm: "จังหวะวันนี้",
    suggestion: "Luma แนะนำ",
    good: "โอเคตามนี้",
    adjusted: "ล็อกแผนแล้ว",
    talk: "คุยกับ Luma",
    refresh: "รีเฟรชบริบท",
    privacy: "ข้อมูลอยู่ในเครื่อง",
    risk: {
      flow: "ลื่นไหล",
      friction: "ติดขัดเล็กน้อย",
      recovery: "ควรพักฟื้น",
      sos: "ดูแลความปลอดภัยก่อน"
    }
  },
  en: {
    now: "Now",
    greeting: "Morning, Beam",
    why: "Show my why",
    hideWhy: "Hide why",
    weather: "Bangkok context",
    energy: "Energy today",
    adjust: "Adjust",
    rhythm: "Today's rhythm",
    suggestion: "Today’s call",
    good: "I’ll follow this",
    adjusted: "Plan locked",
    talk: "Talk with Luma",
    refresh: "Refresh context",
    privacy: "Data stays local",
    risk: {
      flow: "Smooth day",
      friction: "Friction day",
      recovery: "Recovery day",
      sos: "Safety first"
    }
  }
} satisfies Record<Language, {
  now: string;
  greeting: string;
  why: string;
  hideWhy: string;
  weather: string;
  energy: string;
  adjust: string;
  rhythm: string;
  suggestion: string;
  good: string;
  adjusted: string;
  talk: string;
  refresh: string;
  privacy: string;
  risk: Record<IntelligenceOutput["riskLevel"], string>;
}>;

const RISK_STYLE: Record<IntelligenceOutput["riskLevel"], { bg: string; text: string; icon: typeof Gauge; mood: LumaMood }> = {
  flow: { bg: "bg-mint text-moss", text: "text-moss", icon: CheckCircle2, mood: "happy" },
  friction: { bg: "bg-peach text-coral", text: "text-coral", icon: Activity, mood: "concerned" },
  recovery: { bg: "bg-lilac text-ink", text: "text-ink", icon: ShieldCheck, mood: "sleepy" },
  sos: { bg: "bg-coral text-white", text: "text-coral", icon: ShieldCheck, mood: "alert" }
};

export function NowScreen({
  context,
  intelligence,
  energy,
  language,
  onEnergy,
  onLanguage,
  onTalk
}: {
  context: ContextLayer;
  intelligence: IntelligenceOutput;
  energy: number;
  language: Language;
  onEnergy: (value: number) => void;
  onLanguage: (language: Language) => void;
  onTalk: () => void;
}) {
  const [showWhy, setShowWhy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const copy = COPY[language];
  const risk = RISK_STYLE[intelligence.riskLevel];
  const RiskIcon = risk.icon;

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      <section className="now-briefing">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">{copy.now}</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-ink">{copy.greeting}</h1>
          </div>
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/82 text-ink shadow-sm"
            onClick={() => onLanguage(language === "th" ? "en" : "th")}
            aria-label={language === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
          >
            <Languages size={17} />
          </button>
        </div>

        <button className="block w-full" onClick={onTalk} aria-label={copy.talk}>
          <MascotLuma mood={risk.mood} compact />
        </button>

        <p className="text-base font-black leading-7 text-ink">{intelligence.briefing}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black ${risk.bg}`}>
            <RiskIcon size={14} />
            {copy.risk[intelligence.riskLevel]} · {intelligence.riskScore}/100
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/72 px-3 py-2 text-xs font-black text-ink/58">
            <ShieldCheck size={14} />
            {copy.privacy}
          </span>
        </div>

        <button
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-xs font-black text-white transition-transform active:scale-95"
          onClick={() => setShowWhy((value) => !value)}
        >
          <BrainCircuit size={15} />
          {showWhy ? copy.hideWhy : copy.why}
        </button>

        {showWhy && <ReasoningTrail intelligence={intelligence} language={language} />}
      </section>

      <section className="app-panel">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.weather}</p>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[10px] font-black text-ink/50">
            <RefreshCcw size={12} />
            {copy.refresh}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ContextTile icon={CloudFog} label="AQI" value={String(context.weather.aqi)} tone="alert" />
          <ContextTile icon={Thermometer} label={language === "th" ? "ร้อน" : "Heat"} value={`${context.weather.heatIndex}°C`} />
          <ContextTile icon={Droplets} label={language === "th" ? "ชื้น" : "Humidity"} value={`${context.weather.humidity}%`} />
        </div>
      </section>

      <section className="app-panel">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.energy}</p>
            <p className="text-xs font-bold text-ink/48">{energy}/5 · {intelligence.prediction.crashTime ? `${language === "th" ? "เสี่ยงตกช่วง" : "possible dip around"} ${intelligence.prediction.crashTime}` : "steady"}</p>
          </div>
          <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-black text-white" onClick={onTalk}>
            {copy.adjust}
          </button>
        </div>
        <EnergyBead value={energy} language={language} onChange={onEnergy} />
      </section>

      <section className="app-panel">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.rhythm}</p>
        <div className="space-y-2">
          {context.calendar.events.slice(0, 4).map((event) => (
            <article key={event.id} className="rhythm-event">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-mint text-moss">
                <CalendarClock size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-black text-ink">{event.title}</h3>
                  <span className="shrink-0 text-[10px] font-black text-ink/40">{event.startTime.slice(11, 16)}</span>
                </div>
                <p className="mt-0.5 text-xs font-bold leading-5 text-ink/55">{event.lumaNote}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="app-panel border border-moss/12">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-ink text-white">
            <Zap size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-moss">{copy.suggestion}</p>
            <h2 className="mt-1 text-base font-black leading-6 text-ink">{intelligence.recommendation.primary}</h2>
            <p className="mt-2 text-xs font-bold leading-5 text-ink/55">
              {language === "th" ? "เวลาแนะนำ" : "Best timing"}: {intelligence.recommendation.timing}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button
            className={`min-h-11 rounded-2xl px-4 text-sm font-black transition-all active:scale-95 ${accepted ? "bg-mint text-moss" : "bg-ink text-white"}`}
            onClick={() => setAccepted(true)}
          >
            {accepted ? copy.adjusted : copy.good}
          </button>
          <button className="grid min-h-11 w-12 place-items-center rounded-2xl bg-white text-ink shadow-sm" onClick={onTalk} aria-label={copy.talk}>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

function ContextTile({
  icon: Icon,
  label,
  value,
  tone = "normal"
}: {
  icon: typeof CloudFog;
  label: string;
  value: string;
  tone?: "normal" | "alert";
}) {
  return (
    <div className={`rounded-2xl px-3 py-3 ${tone === "alert" ? "bg-peach text-coral" : "bg-white/72 text-ink"}`}>
      <div className="flex items-center gap-1.5">
        <Icon size={14} />
        <span className="text-[9px] font-black uppercase tracking-wide opacity-70">{label}</span>
      </div>
      <p className="mt-1 text-xl font-black leading-none">{value}</p>
    </div>
  );
}

function ReasoningTrail({
  intelligence,
  language
}: {
  intelligence: IntelligenceOutput;
  language: Language;
}) {
  return (
    <div className="reasoning-trail mt-4">
      <div className="mb-2 flex items-center gap-2">
        <Info size={14} className="text-moss" />
        <p className="text-xs font-black text-ink">{language === "th" ? "Luma รวมสัญญาณเหล่านี้" : "What Luma noticed"}</p>
      </div>
      <div className="space-y-1.5">
        {intelligence.reasoningTrail.map((item) => (
          <div key={item} className="rounded-xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-ink/60">
            {item}
          </div>
        ))}
        <div className="rounded-xl bg-mint/55 px-3 py-2 text-xs font-black leading-5 text-moss">
          {intelligence.prediction.reasoning} · {intelligence.prediction.confidence}% confidence
        </div>
      </div>
    </div>
  );
}
