"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home,
  MessageCircle,
  UserRound
} from "lucide-react";
import { aiDecisionLog, demoNotifications, mockCalendar, pitchChecklist, scenarios, seedEntries } from "@/data/seed";
import { buildContextLayer, fuseIntelligence } from "@/lib/fusion-engine";
import { navCopy } from "@/lib/i18n";
import { buildPatterns, extractState } from "@/lib/wellness";
import type { DailyEntry, ExternalContext, Language } from "@/lib/types";

import type { DebugActionId }  from "@/components/DebugControls";
import { JudgePanel }     from "@/components/JudgePanel";
import { ProjectBriefPanel } from "@/components/ProjectBriefPanel";
import { NowScreen } from "@/components/screens/NowScreen";
import { TalkScreen } from "@/components/screens/TalkScreen";
import { YouScreen } from "@/components/screens/YouScreen";

type Screen = "now" | "talk" | "you";

const DEFAULT_CHECKIN =
  "I slept about five hours, Bangkok air feels heavy, and I already feel low before lunch.";

const LANGUAGE_STORAGE_KEY = "routinesense-language-v2";

const NAV_IDS: Array<{ id: Screen; icon: typeof Home }> = [
  { id: "now",  icon: Home },
  { id: "talk", icon: MessageCircle },
  { id: "you",  icon: UserRound }
];

function getHashScreen(): Screen {
  const screen = window.location.hash.replace("#", "") as Screen | "home" | "checkin" | "calendar" | "coach" | "insights" | "profile";
  if (screen === "home") return "now";
  if (screen === "checkin" || screen === "coach") return "talk";
  if (screen === "calendar" || screen === "insights" || screen === "profile") return "you";
  return NAV_IDS.some((tab) => tab.id === screen) ? screen : "now";
}

export default function HomePage() {
  const [screen,      setScreenState] = useState<Screen>("now");
  const [entries,     setEntries]     = useState<DailyEntry[]>(seedEntries);
  const [checkin,     setCheckin]     = useState(DEFAULT_CHECKIN);
  const [activeEntry, setActiveEntry] = useState(seedEntries[seedEntries.length - 1]);
  const [energyRating, setEnergyRating] = useState(3);
  const [language, setLanguage] = useState<Language>("en");
  const [externalContext, setExternalContext] = useState<ExternalContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const patterns = useMemo(() => buildPatterns(entries), [entries]);
  const contextLayer = useMemo(() => buildContextLayer({
    entry: activeEntry,
    diary: checkin,
    energy: energyRating,
    language,
    externalContext,
    events: mockCalendar
  }), [activeEntry, checkin, energyRating, externalContext, language]);
  const intelligence = useMemo(() => fuseIntelligence(contextLayer), [contextLayer]);

  useEffect(() => {
    setScreenState(getHashScreen());
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    const initialLanguage = stored === "en" || stored === "th"
      ? stored
      : process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE === "th"
        ? "th"
        : "en";
    setLanguage(initialLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled && payload?.success && payload.data) {
          setExternalContext(payload.data);
        }
      })
      .catch(() => {
        if (!cancelled) setExternalContext(null);
      });
    return () => {
      cancelled = true;
    };
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
    const next: DailyEntry = { ...extractState(checkin), energy: energyRating, mood: energyRating + 3, date: "2026-05-09" };
    setActiveEntry(next);
    setEntries((cur) => [...cur.slice(-29), next]);
    setScreen("now");
  }

  function loadScenario(text: string) {
    const next: DailyEntry = { ...extractState(text), date: "2026-05-08" };
    setCheckin(text);
    setActiveEntry(next);
  }

  function runDemoTest(id: DebugActionId) {
    if (id === "reset") {
      setEntries(seedEntries);
      setCheckin(DEFAULT_CHECKIN);
      setActiveEntry(seedEntries[seedEntries.length - 1]);
      setEnergyRating(3);
      setScreen("now");
      return;
    }

    if (id === "notify") {
      setScreen("now");
      return;
    }

    const scenarioId = id === "sleep" ? "balanced" : id === "crash" ? "aqi" : id === "safety" ? "crisis" : id;
    const scenario = scenarios.find((item) => item.id === scenarioId);
    if (scenario) {
      loadScenario(scenario.checkin);
      setEnergyRating(scenario.id === "balanced" ? 4 : scenario.id === "safety" ? 1 : 3);
      setScreen(id === "sleep" ? "now" : "talk");
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

        <ProjectBriefPanel language={language} />

        {/* Phone shell */}
        <section className="phone-shell" aria-label="RoutineSense AI mobile app">
          <div className="phone-speaker" aria-hidden="true" />
          <div className="phone-camera"  aria-hidden="true" />

          <div className="phone-screen">
            {/* Status bar */}
            <StatusBar onProfile={() => setScreen("you")} />

            {/* Screen content */}
            <div className="app-scroll" ref={scrollRef}>
              {screen === "now" && (
                <NowScreen
                  context={contextLayer}
                  intelligence={intelligence}
                  energy={energyRating}
                  language={language}
                  onEnergy={setEnergyRating}
                  onLanguage={setLanguage}
                  onTalk={() => setScreen("talk")}
                />
              )}
              {screen === "talk" && (
                <TalkScreen
                  context={contextLayer}
                  intelligence={intelligence}
                  checkin={checkin}
                  language={language}
                  onCheckin={setCheckin}
                  onSaveMemory={submitCheckin}
                />
              )}
              {screen === "you" && (
                <YouScreen
                  entries={entries}
                  patterns={patterns}
                  language={language}
                  onLanguage={setLanguage}
                />
              )}
            </div>

            {/* Bottom nav */}
            <BottomNav active={screen} language={language} onChange={setScreen} />
          </div>
        </section>

        <JudgePanel
          notifications={demoNotifications}
          logs={aiDecisionLog}
          checklist={pitchChecklist}
          onRunTest={runDemoTest}
          language={language}
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
          aria-label="Open profile"
        >
          <UserRound size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Bottom Nav ─────────────────────────────────────────────── */
function BottomNav({ active, language, onChange }: { active: Screen; language: Language; onChange: (s: Screen) => void }) {
  const labels = navCopy[language];
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_IDS.map(({ id, icon: Icon }) => (
        <button
          key={id}
          id={`nav-${id}`}
          className={`nav-button ${active === id ? "nav-button-active" : ""}`}
          onClick={() => onChange(id)}
          aria-label={labels[id]}
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={18} />
          <span>{labels[id]}</span>
        </button>
      ))}
    </nav>
  );
}
