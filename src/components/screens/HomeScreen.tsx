"use client";

import { Bell, CloudFog, Flame, MapPin, Moon, Thermometer } from "lucide-react";
import { EnergyForecast } from "@/components/EnergyForecast";
import { LumaScore } from "@/components/LumaScore";
import { MascotLuma } from "@/components/MascotLuma";
import { ProactiveNotification } from "@/components/ProactiveNotification";
import { TodayRhythm } from "@/components/TodayRhythm";
import type { CalendarEvent, DemoNotification, EnergyForecast as EnergyForecastType, ExternalContext, Language, LumaScore as LumaScoreType, LumaState, Recommendation } from "@/lib/types";
import { demoUser, todayContext } from "@/data/seed";

const HOME_COPY = {
  th: {
    todayIn: "วันนี้ใน",
    heat: "ร้อน",
    sleep: "นอน",
    hour: "ชม.",
    lumaState: "สถานะของ Luma",
    live: "ข้อมูลจริง",
    partial: "ข้อมูลบางส่วน",
    mock: "ข้อมูลจำลอง",
    greetingMorning: "สวัสดีตอนเช้า",
    greetingAfternoon: "สวัสดีตอนบ่าย",
    greetingEvening: "สวัสดีตอนเย็น",
    namePrefix: "คุณ"
  },
  en: {
    todayIn: "Today in",
    heat: "Heat",
    sleep: "Sleep",
    hour: "h",
    lumaState: "Luma state",
    live: "Live data",
    partial: "Partial live data",
    mock: "Mock data",
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    namePrefix: "Hi,"
  }
};

function EnergyWeatherCard({
  externalContext,
  language,
  onOpen
}: {
  externalContext: ExternalContext | null;
  language: Language;
  onOpen: () => void;
}) {
  const copy = HOME_COPY[language];
  const context = externalContext ?? {
    location: todayContext.location,
    aqi: todayContext.aqi,
    heatIndex: todayContext.heatIndex,
    humidity: todayContext.humidity,
    temperature: todayContext.temperature,
    source: "mock" as const
  };
  const headline = language === "en"
    ? `${context.location === "กรุงเทพฯ" ? "Bangkok" : context.location} air needs a lighter plan`
    : todayContext.headline;
  const recommendation = language === "en"
    ? "Close windows, skip outdoor running, and do a 10-minute indoor stretch before lunch."
    : todayContext.recommendation;
  const sourceLabel = copy[context.source as "live" | "partial" | "mock"] ?? copy.mock;

  return (
    <button className="energy-weather-card" onClick={onOpen} aria-label="เปิดแผนพลังงานของวันนี้">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-coral">
            <MapPin size={12} />
            {copy.todayIn} {language === "en" && context.location === "กรุงเทพฯ" ? "Bangkok" : context.location}
          </div>
          <p className="mt-1 text-sm font-black leading-5 text-ink">{headline}</p>
          <p className="mt-1 text-[10px] font-black text-ink/38">{sourceLabel}</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-coral/15 text-coral">
          <CloudFog size={22} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <WeatherMetric icon={CloudFog} label="AQI" value={String(context.aqi)} alert />
        <WeatherMetric icon={Thermometer} label={copy.heat} value={`${context.heatIndex}C`} />
        <WeatherMetric icon={Moon} label={copy.sleep} value={`${todayContext.sleepHours}${copy.hour}`} />
      </div>

      <p className="mt-3 rounded-2xl bg-white/72 px-3 py-2 text-left text-xs font-bold leading-5 text-ink/72">
        {recommendation}
      </p>
    </button>
  );
}

function WeatherMetric({
  icon: Icon,
  label,
  value,
  alert = false
}: {
  icon: typeof CloudFog;
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-2xl px-2.5 py-2 ${alert ? "bg-coral/10 text-coral" : "bg-white/70 text-ink"}`}>
      <div className="flex items-center gap-1">
        <Icon size={13} />
        <span className="text-[9px] font-black uppercase tracking-wide opacity-70">{label}</span>
      </div>
      <p className="mt-1 text-[17px] font-black leading-none">{value}</p>
    </div>
  );
}

export function HomeScreen({
  recommendation,
  lumaScore,
  lumaState,
  forecast,
  events,
  notification,
  externalContext,
  language,
  onLanguage,
  onGoCheckin,
  onGoCoach
}: {
  recommendation: Recommendation;
  lumaScore: LumaScoreType;
  lumaState: LumaState;
  forecast: EnergyForecastType;
  events: CalendarEvent[];
  notification?: DemoNotification;
  externalContext: ExternalContext | null;
  language: Language;
  onLanguage: (language: Language) => void;
  onGoCheckin: () => void;
  onGoCoach: () => void;
}) {
  const copy = HOME_COPY[language];
  const crisis = recommendation.safetyState === "crisis";
  const hour = 9; // mock time
  const greeting = hour < 12 ? copy.greetingMorning : hour < 17 ? copy.greetingAfternoon : copy.greetingEvening;
  const mascotMood = crisis ? "alert" : lumaState.mood;

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      {/* ── Hero Card ── */}
      <section className="hero-room">
        {/* Top row */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">{greeting}</p>
            <h2 className="text-2xl font-black text-ink leading-tight">{copy.namePrefix} {demoUser.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-black text-ink shadow-sm"
              onClick={() => onLanguage(language === "th" ? "en" : "th")}
              aria-label={language === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
            >
              {language === "th" ? "TH" : "EN"}
            </button>
            <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1.5 shadow-sm">
              <Flame size={13} className="text-coral" style={{ animation: "heart-beat 1.4s ease-in-out infinite" }} />
              <span className="text-xs font-black text-ink">{demoUser.streak}</span>
            </div>
            <button
              className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-moss shadow-sm"
              aria-label="แจ้งเตือน"
            >
              <Bell size={16} />
            </button>
          </div>
        </div>

        <MascotLuma mood={mascotMood} />
      </section>

        <EnergyWeatherCard externalContext={externalContext} language={language} onOpen={onGoCoach} />

      <div className="rounded-2xl bg-white/72 px-3 py-3 shadow-sm border border-white/60">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-moss">{copy.lumaState}</p>
        <p className="mt-1 text-sm font-black leading-relaxed text-ink">{lumaState.message}</p>
        <p className="mt-1.5 text-[11px] font-bold leading-relaxed text-ink/60">{lumaState.suggestion}</p>
      </div>

      {notification && <ProactiveNotification notification={notification} />}
      <LumaScore score={lumaScore} onWhy={onGoCoach} />
      <EnergyForecast forecast={forecast} />
      <TodayRhythm events={events} onAdd={onGoCheckin} />
    </div>
  );
}
