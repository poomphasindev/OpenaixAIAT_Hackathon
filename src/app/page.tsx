"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Home,
  MessageCircle,
  SmilePlus,
  Zap,
  UserRound
} from "lucide-react";
import { aiDecisionLog, currentLumaScoreInput, demoNotifications, mockCalendar, mockForecast, pitchChecklist, scenarios, seedEntries } from "@/data/seed";
import { calculateLumaScore, buildPatterns, createRecommendation, determineLumaState, extractState } from "@/lib/wellness";
import type { DailyEntry, Feedback } from "@/lib/types";

import type { DebugActionId }  from "@/components/DebugControls";
import { JudgePanel }     from "@/components/JudgePanel";
import { ProjectBriefPanel } from "@/components/ProjectBriefPanel";
import { HomeScreen }     from "@/components/screens/HomeScreen";
import { CheckinScreen }  from "@/components/screens/CheckinScreen";
import { CoachScreen }    from "@/components/screens/CoachScreen";
import { CalendarScreen } from "@/components/screens/CalendarScreen";
import { InsightsScreen } from "@/components/screens/InsightsScreen";
import { ProfileScreen }  from "@/components/screens/ProfileScreen";

type Screen = "home" | "checkin" | "calendar" | "coach" | "insights" | "profile";

const DEFAULT_CHECKIN =
  "เมื่อคืนผมนอนน้อยประมาณห้าชั่วโมง อากาศข้างนอกฝุ่นเยอะ และก่อนเที่ยงก็เริ่มหมดแรงแล้ว";

const NAV_TABS: Array<{ id: Screen; label: string; icon: typeof Home }> = [
  { id: "home",     label: "วันนี้",    icon: Home },
  { id: "checkin",  label: "เช็ค",   icon: SmilePlus },
  { id: "calendar", label: "เดือน",   icon: CalendarDays },
  { id: "coach",    label: "โค้ช",   icon: MessageCircle },
  { id: "insights", label: "อินไซต์", icon: Zap }
];

function getHashScreen(): Screen {
  const screen = window.location.hash.replace("#", "") as Screen;
  return NAV_TABS.some((tab) => tab.id === screen) || screen === "profile" ? screen : "home";
}

function getWellnessScore(entry: DailyEntry) {
  return Math.max(28, Math.min(96, Math.round(
    entry.energy * 6 + entry.mood * 4 + entry.sleepQuality * 4 +
    (10 - entry.stress) * 3 + Math.min(entry.movement, 40) * 0.35
  )));
}

export default function HomePage() {
  const [screen,      setScreenState] = useState<Screen>("home");
  const [entries,     setEntries]     = useState<DailyEntry[]>(seedEntries);
  const [checkin,     setCheckin]     = useState(DEFAULT_CHECKIN);
  const [activeEntry, setActiveEntry] = useState(seedEntries[seedEntries.length - 1]);
  const [selectedDay, setSelectedDay] = useState(seedEntries[seedEntries.length - 1]);
  const [moodRating,  setMoodRating]  = useState(3);
  const [feedback,    setFeedback]    = useState<Feedback>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const recommendation = useMemo(
    () => createRecommendation(activeEntry, entries),
    [activeEntry, entries]
  );
  const patterns = useMemo(() => buildPatterns(entries), [entries]);
  const monthAverage = Math.round(
    entries.reduce((sum, e) => sum + getWellnessScore(e), 0) / entries.length
  );
  const lumaScore = useMemo(() => calculateLumaScore({
    ...currentLumaScoreInput,
    stress: activeEntry.stress,
    caffeine: activeEntry.caffeine
  }), [activeEntry.caffeine, activeEntry.stress]);
  const lumaState = useMemo(() => determineLumaState({
    ...currentLumaScoreInput,
    stress: activeEntry.stress,
    caffeine: activeEntry.caffeine,
    streak: 15,
    followedPlan: activeEntry.recommendationHelped,
    hour: 9
  }), [activeEntry.caffeine, activeEntry.recommendationHelped, activeEntry.stress]);

  useEffect(() => {
    setScreenState(getHashScreen());
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [screen]);

  function setScreen(screen: Screen) {
    setScreenState(screen);
    window.requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${screen}`);
    }
  }

  function submitCheckin() {
    const next: DailyEntry = { ...extractState(checkin), mood: moodRating + 3, date: "2026-05-08" };
    setActiveEntry(next);
    setSelectedDay(next);
    setEntries((cur) => [...cur.slice(-29), next]);
    setFeedback(null);
    setVoiceActive(false);
    setScreen("home");
  }

  function loadScenario(text: string) {
    const next: DailyEntry = { ...extractState(text), date: "2026-05-08" };
    setCheckin(text);
    setActiveEntry(next);
    setSelectedDay(next);
    setFeedback(null);
  }

  function runDemoTest(id: DebugActionId) {
    if (id === "reset") {
      setEntries(seedEntries);
      setCheckin(DEFAULT_CHECKIN);
      setActiveEntry(seedEntries[seedEntries.length - 1]);
      setSelectedDay(seedEntries[seedEntries.length - 1]);
      setMoodRating(3);
      setFeedback(null);
      setVoiceActive(false);
      setScreen("home");
      return;
    }

    if (id === "notify") {
      setScreen("home");
      return;
    }

    const scenarioId = id === "sleep" ? "balanced" : id === "crash" ? "aqi" : id;
    const scenario = scenarios.find((item) => item.id === scenarioId);
    if (scenario) {
      loadScenario(scenario.checkin);
      setMoodRating(scenario.id === "balanced" ? 4 : scenario.id === "safety" ? 1 : 3);
      setScreen(scenario.id === "safety" ? "coach" : id === "sleep" ? "home" : "coach");
    }
  }

  return (
    <main
      className="min-h-dvh overflow-hidden px-4 py-3 sm:px-6"
      style={{
        background: "linear-gradient(160deg, #fffdf7 0%, #e8f3f8 50%, #f9f0fc 100%)"
      }}
    >
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-[1280px] items-center justify-center gap-4 xl:gap-6">

        <ProjectBriefPanel />

        {/* Phone shell */}
        <section className="phone-shell" aria-label="RoutineSense AI mobile app">
          <div className="phone-speaker" aria-hidden="true" />
          <div className="phone-camera"  aria-hidden="true" />

          <div className="phone-screen">
            {/* Status bar */}
            <StatusBar onProfile={() => setScreen("profile")} />

            {/* Screen content */}
            <div className="app-scroll" ref={scrollRef}>
              {screen === "home" && (
                <HomeScreen
                  recommendation={recommendation}
                  lumaScore={lumaScore}
                  lumaState={lumaState}
                  forecast={mockForecast}
                  events={mockCalendar}
                  notification={demoNotifications[1]}
                  onGoCheckin={() => setScreen("checkin")}
                  onGoCoach={() => setScreen("coach")}
                />
              )}
              {screen === "checkin" && (
                <CheckinScreen
                  checkin={checkin}
                  moodRating={moodRating}
                  voiceActive={voiceActive}
                  onMood={setMoodRating}
                  onCheckin={setCheckin}
                  onSubmit={submitCheckin}
                  onVoice={() => setVoiceActive((v) => !v)}
                  onScenario={loadScenario}
                />
              )}
              {screen === "calendar" && (
                <CalendarScreen
                  entries={entries}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                />
              )}
              {screen === "coach" && (
                <CoachScreen
                  checkin={checkin}
                  recommendation={recommendation}
                  onCheckin={setCheckin}
                  onSubmit={submitCheckin}
                  onScenario={loadScenario}
                />
              )}
              {screen === "insights" && (
                <InsightsScreen
                  entries={entries}
                  patterns={patterns}
                  average={monthAverage}
                />
              )}
              {screen === "profile" && (
                <ProfileScreen onBack={() => setScreen("home")} />
              )}
            </div>

            {/* Bottom nav */}
            <BottomNav active={screen} onChange={setScreen} />
          </div>
        </section>

        <JudgePanel
          notifications={demoNotifications}
          logs={aiDecisionLog}
          checklist={pitchChecklist}
          onRunTest={runDemoTest}
        />
      </div>
    </main>
  );
}

/* ── Status Bar ─────────────────────────────────────────────── */
function StatusBar({ onProfile }: { onProfile: () => void }) {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal dots */}
        {[4, 3, 2].map((h) => (
          <span
            key={h}
            className="rounded-sm bg-ink"
            style={{ width: 3, height: h * 2, opacity: 0.7 }}
          />
        ))}
        {/* Battery */}
        <span className="ml-1 text-[10px] font-black text-ink/60">87%</span>
        <button
          className="grid h-7 w-7 place-items-center rounded-full bg-white/75 text-moss shadow-sm"
          onClick={onProfile}
          aria-label="เปิดโปรไฟล์"
        >
          <UserRound size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Bottom Nav ─────────────────────────────────────────────── */
function BottomNav({ active, onChange }: { active: Screen; onChange: (s: Screen) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          id={`nav-${id}`}
          className={`nav-button ${active === id ? "nav-button-active" : ""}`}
          onClick={() => onChange(id)}
          aria-label={label}
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
