import type {
  AiDecisionLog,
  CalendarEvent,
  DailyEntry,
  DemoNotification,
  EnergyForecast,
  HiddenPattern,
  PitchPoint,
  Scenario,
  WeeklyLetter
} from "@/lib/types";

type DaySeed = {
  date: string;
  mood: number;
  energy: number;
  stress: number;
  sleepQuality: number;
  caffeine: number;
  movement: number;
  workLoad: number;
  meals: DailyEntry["meals"];
  environmentContext: string[];
  frictionReason: string;
  helped: boolean;
};

export const demoUser = {
  name: "Beam",
  age: 24,
  city: "Bangkok",
  streak: 15,
  joinedDaysAgo: 31,
  goal: "keep energy steady during the hackathon",
  persona: "student builder who codes late, drinks coffee, and wants kinder routines"
};

export const todayContext = {
  location: "Bangkok",
  aqi: 145,
  temperature: 34,
  heatIndex: 41,
  sleepHours: 5,
  humidity: 66,
  commuteLoad: "medium",
  headline: "Bangkok air is heavier than usual today",
  recommendation: "Close the windows, move outdoor running indoors, and stretch for 10 minutes before lunch",
  crashWindow: "15:00"
};

export const currentLumaScoreInput = {
  sleepHours: todayContext.sleepHours,
  aqi: todayContext.aqi,
  energyBead: 4,
  stress: 7,
  lastWeekScore: 73,
  caffeine: 3,
  heatIndex: todayContext.heatIndex
};

export const mockForecast: EnergyForecast = {
  timeSlots: [
    { time: "08:00", status: "stable", confidence: 90, recommendation: "Start with light tasks" },
    { time: "10:00", status: "optimal", confidence: 85, recommendation: "Deep work window" },
    { time: "12:00", status: "declining", confidence: 75, recommendation: "Eat before hunger hits" },
    { time: "15:00", status: "crash", confidence: 80, recommendation: "Indoor reset, no extra coffee" },
    { time: "17:00", status: "recovery", confidence: 70, recommendation: "Light reading or admin" },
    { time: "20:00", status: "stable", confidence: 65, recommendation: "Prep tomorrow, dim screens" }
  ],
  summary: "Energy dip predicted around 15:00 from 5h sleep + AQI 145"
};

export const mockCalendar: CalendarEvent[] = [
  {
    id: "cal-commute",
    title: "BTS commute",
    type: "commute",
    startTime: "2026-05-09T08:30:00",
    endTime: "2026-05-09T09:15:00",
    energyImpact: "medium",
    lumaNote: "AQI 145 today. Wear a mask and reduce outdoor walking."
  },
  {
    id: "cal-review",
    title: "Sprint review",
    type: "deadline",
    startTime: "2026-05-09T10:00:00",
    endTime: "2026-05-09T11:30:00",
    energyImpact: "high",
    lumaNote: "High-focus block. Eat before you start."
  },
  {
    id: "cal-lunch",
    title: "Protected lunch",
    type: "meal",
    startTime: "2026-05-09T12:00:00",
    endTime: "2026-05-09T12:30:00",
    energyImpact: "recovery",
    lumaNote: "Protected before the likely 15:00 dip."
  },
  {
    id: "cal-family",
    title: "Dinner with family",
    type: "social",
    startTime: "2026-05-09T19:00:00",
    endTime: "2026-05-09T21:00:00",
    energyImpact: "recovery",
    lumaNote: "A real recovery block. Do not cut this first."
  }
];

export const demoNotifications: DemoNotification[] = [
  {
    id: "n1",
    type: "proactive",
    title: "Morning brief",
    body: "AQI is 145. Luma moved the outdoor run to an indoor stretch.",
    timestamp: "08:00",
    action: "View plan"
  },
  {
    id: "n2",
    type: "alert",
    title: "Energy dip predicted",
    body: "Based on sleep + AQI, you may dip around 15:00. Eat before noon.",
    timestamp: "11:30",
    action: "Set reminder"
  },
  {
    id: "n3",
    type: "celebration",
    title: "7-day check-in streak",
    body: "You logged 7 days. Luma found 3 new patterns in your week.",
    timestamp: "20:00",
    action: "Read summary"
  },
  {
    id: "n4",
    type: "proactive",
    title: "Wind-down window",
    body: "Sprint review tomorrow. Sleep before 23:30 to make the morning easier.",
    timestamp: "22:00",
    action: "Set alarm"
  }
];

export const weeklyLetter: WeeklyLetter = {
  weekNumber: 3,
  daysLogged: 7,
  opening: "Hey Beam,\n\nYou checked in for a full 7 days. Here is the honest version of what Luma noticed:",
  highlights: [
    {
      type: "win",
      title: "Best day: May 7",
      description: "7h sleep, indoor movement, and lighter caffeine. That was closest to your flow rhythm."
    },
    {
      type: "challenge",
      title: "Hardest day: May 8",
      description: "AQI 145 plus 5h sleep made the day heavier, but you still checked in."
    },
    {
      type: "pattern",
      title: "Pattern to test",
      description: "Late caffeine plus screen-heavy work often appears before shorter sleep."
    }
  ],
  lumaInsight: "Your energy dips are not random. They cluster around high AQI, short sleep, and late caffeine.",
  recommendation: "Next week, try ending caffeine before 14:00. Let’s see if sleep gets easier.",
  closing: "No need to be perfect, Beam. Noticing the pattern is already progress.\n\nLuma",
  thaiContext: "Bangkok AQI averaged around 135 this week, so Luma moved outdoor activity into indoor recovery blocks."
};

export const hiddenPatterns: HiddenPattern[] = [
  {
    id: "hidden-pm25-lunch",
    title: "PM2.5 lunch drift",
    description: "On high-AQI days, lunch tends to slide 2-3 hours later",
    evidence: ["May 3: AQI 160, lunch 14:30", "May 7: AQI 155, lunch 15:00", "May 8: AQI 145, light meal"],
    confidence: 85,
    status: "hidden",
    reward: "Bangkok-specific pattern found"
  },
  {
    id: "hidden-caffeine-loop",
    title: "Afternoon caffeine loop",
    description: "Coffee after 15:00 often comes before poor sleep and more coffee the next day",
    evidence: ["Apr 16", "Apr 27", "May 6"],
    confidence: 90,
    status: "revealed",
    reward: "A loop worth testing"
  },
  {
    id: "hidden-family-recharge",
    title: "Family recharge window",
    description: "Dinner with family often steadies the next day, unless it is followed by late coding",
    evidence: ["Apr 13", "Apr 29", "May 7"],
    confidence: 72,
    status: "hidden",
    reward: "A kinder routine pattern"
  }
];

export const aiDecisionLog: AiDecisionLog[] = [
  { id: "log-1", kind: "input", text: "Beam checked in: energy 3/5, stress 7/10" },
  { id: "log-2", kind: "rule", text: "Rule: AQI > 100 moves outdoor activity indoors" },
  { id: "log-3", kind: "pattern", text: "Pattern match: sleep < 6h + high AQI often precedes a 15:00 dip" },
  { id: "log-4", kind: "recommendation", text: "Recommendation: eat before noon + 10-minute indoor reset" }
];

export const pitchChecklist: PitchPoint[] = [
  { id: "pitch-thai", label: "Thai context is obvious in the first 3 seconds", done: true },
  { id: "pitch-privacy", label: "Privacy by design", done: true },
  { id: "pitch-collab", label: "AI learns with the user", done: true },
  { id: "pitch-proactive", label: "Warns before the energy dip", done: true },
  { id: "pitch-real-api", label: "Live APIs enabled after .env", done: true },
  { id: "pitch-camera", label: "Camera face tracking", done: false }
];

export const thaiContextMarkers = [
  { date: "2026-04-13", label: "สงกรานต์/ครอบครัว", type: "social" },
  { date: "2026-04-15", label: "AQI พุ่ง", type: "aqi" },
  { date: "2026-04-16", label: "กาแฟช่วงเย็น", type: "caffeine" },
  { date: "2026-04-23", label: "งาน sprint หนัก", type: "work" },
  { date: "2026-04-24", label: "AQI + นอนน้อย", type: "aqi" },
  { date: "2026-05-05", label: "PM2.5 อยู่ในห้อง", type: "aqi" },
  { date: "2026-05-06", label: "coding ดึก", type: "caffeine" },
  { date: "2026-05-08", label: "วัน hackathon", type: "work" }
];

export const thaiPatternAtlas = [
  {
    id: "pm25-loop",
    title: "PM2.5 ทำให้ขยับตัวน้อยลง",
    evidence: "วันที่ AQI สูงตรงกับวันที่ข้าม movement 3 จาก 3 ครั้ง",
    action: "ย้าย movement เข้าห้องก่อนเที่ยง ไม่ใช่รอให้พลังตกแล้วค่อยเริ่ม"
  },
  {
    id: "bangkok-sprint",
    title: "ความล้าจาก sprint ในกรุงเทพฯ",
    evidence: "coding ดึก + ใช้จอหนัก มักมาก่อนวันที่พลังต่ำ 4 ครั้ง",
    action: "ล็อกมื้ออาหารหนึ่งมื้อก่อนเข้า deep work"
  },
  {
    id: "heat-sleep",
    title: "คืนร้อนทำให้ฟื้นตัวยาก",
    evidence: "นอนน้อย + อากาศร้อนจับกลุ่มกัน 2 ครั้งในสัปดาห์นี้",
    action: "ทำงานแรกให้เล็กลง และคุมกาแฟก่อน 15:00"
  }
];

const daySeeds: DaySeed[] = [
  day("2026-04-09", 6, 6, 5, 6, 2, 18, 6, "regular", ["campus"], "normal load", true),
  day("2026-04-10", 5, 4, 7, 4, 3, 8, 8, "late", ["screen-heavy"], "short sleep", false),
  day("2026-04-11", 7, 7, 4, 7, 1, 32, 5, "regular", ["clear air"], "none", true),
  day("2026-04-12", 6, 5, 5, 6, 2, 15, 6, "light", ["humid"], "meal timing", true),
  day("2026-04-13", 8, 8, 3, 8, 1, 40, 4, "regular", ["family day"], "none", true),
  day("2026-04-14", 7, 6, 4, 7, 1, 28, 5, "regular", ["indoor walk"], "none", true),
  day("2026-04-15", 5, 4, 6, 5, 2, 7, 7, "skipped", ["high AQI"], "poor air quality", true),
  day("2026-04-16", 4, 3, 7, 3, 4, 10, 8, "light", ["screen-heavy"], "caffeine-sleep loop", false),
  day("2026-04-17", 6, 6, 5, 6, 2, 24, 6, "regular", ["clear air"], "normal load", true),
  day("2026-04-18", 7, 7, 4, 7, 1, 34, 5, "regular", ["indoor walk"], "none", true),
  day("2026-04-19", 5, 5, 6, 5, 2, 12, 7, "late", ["messages"], "social load", false),
  day("2026-04-20", 6, 5, 6, 6, 3, 14, 7, "regular", ["screen-heavy"], "late caffeine", true),
  day("2026-04-21", 8, 8, 3, 8, 1, 42, 4, "regular", ["clear air"], "none", true),
  day("2026-04-22", 6, 6, 5, 6, 2, 20, 6, "regular", ["campus"], "normal load", true),
  day("2026-04-23", 4, 4, 8, 5, 2, 8, 9, "late", ["meetings", "screen-heavy"], "overloaded workday", true),
  day("2026-04-24", 5, 4, 7, 4, 3, 9, 8, "skipped", ["high AQI"], "short sleep and poor air", false),
  day("2026-04-25", 7, 7, 4, 7, 1, 31, 5, "regular", ["indoor walk"], "movement helped", true),
  day("2026-04-26", 6, 5, 5, 6, 2, 18, 6, "regular", ["humid"], "normal load", true),
  day("2026-04-27", 5, 4, 7, 4, 4, 11, 8, "light", ["screen-heavy"], "caffeine-sleep loop", false),
  day("2026-04-28", 7, 6, 4, 7, 1, 26, 5, "regular", ["clear air"], "none", true),
  day("2026-04-29", 8, 8, 3, 8, 1, 38, 4, "regular", ["indoor walk"], "steady rhythm", true),
  day("2026-04-30", 6, 6, 5, 6, 2, 22, 6, "regular", ["campus"], "normal load", true),
  day("2026-05-01", 5, 4, 7, 4, 3, 9, 8, "late", ["screen-heavy"], "late sleep and skipped breakfast", false),
  day("2026-05-02", 5, 4, 6, 4, 3, 10, 7, "skipped", ["humid", "screen-heavy"], "late sleep and skipped breakfast", false),
  day("2026-05-03", 7, 7, 4, 7, 1, 35, 5, "regular", ["clear air"], "morning walk helped", true),
  day("2026-05-04", 4, 4, 8, 6, 2, 8, 9, "late", ["meetings", "screen-heavy"], "overloaded workday", true),
  day("2026-05-05", 5, 4, 5, 5, 2, 5, 6, "regular", ["high AQI", "indoor day"], "poor air quality", true),
  day("2026-05-06", 4, 3, 7, 3, 4, 12, 8, "light", ["screen-heavy"], "short sleep and caffeine loop", false),
  day("2026-05-07", 8, 8, 3, 7, 1, 30, 5, "regular", ["indoor walk"], "balanced day", true),
  day("2026-05-08", 5, 3, 7, 3, 3, 6, 8, "light", ["high AQI", "hackathon", "screen-heavy"], "low sleep and poor air", true)
];

export const seedEntries: DailyEntry[] = daySeeds.map((seed, index) => ({
  id: `day-${index + 1}`,
  date: seed.date,
  moment: "evening",
  rawText: makeDiary(seed),
  mood: seed.mood,
  energy: seed.energy,
  stress: seed.stress,
  sleepQuality: seed.sleepQuality,
  caffeine: seed.caffeine,
  meals: seed.meals,
  movement: seed.movement,
  workLoad: seed.workLoad,
  socialLoad: seed.workLoad > 7 ? 7 : 3,
  environmentContext: seed.environmentContext,
  frictionReason: seed.frictionReason,
  tomorrowIntent: seed.energy <= 4 ? "protect recovery before coding" : "keep the steady routine",
  helpRequest: seed.stress >= 7 ? "make the day feel less overloaded" : "keep energy stable",
  recommendationHelped: seed.helped
}));

export const todaySchedule = [
  {
    time: "09:10",
    label: "Soft start",
    detail: "Water + breakfast before the first sprint",
    status: "done"
  },
  {
    time: "12:30",
    label: "Protected lunch",
    detail: "Eat away from the laptop for one short block",
    status: "next"
  },
  {
    time: "14:30",
    label: "Indoor reset",
    detail: "Walk indoors for 10 minutes, no extra coffee yet",
    status: "alert"
  },
  {
    time: "21:40",
    label: "Landing strip",
    detail: "Dim screens and park tomorrow's task list",
    status: "later"
  }
];

export const coachMessages = [
  {
    from: "RoutineSense",
    text: "Luma sees a pattern like May 5-6: short sleep, high AQI, and heavy screen work. Today should be smaller and more recoverable."
  },
  {
    from: "Beam",
    text: "I still need to build tonight. I cannot rest all day."
  },
  {
    from: "RoutineSense",
    text: "Then the win is not resting all day. The win is protecting the 15:00 dip: eat first, move indoors, then lock one build block."
  }
];

export const scenarios: Scenario[] = [
  {
    id: "aqi",
    label: "Low sleep + high AQI",
    checkin: "I slept about five hours, the air outside feels heavy, and I already feel low before lunch."
  },
  {
    id: "caffeine",
    label: "Caffeine loop",
    checkin: "I had too much coffee yesterday and slept late again. I want to focus today without crashing twice."
  },
  {
    id: "overload",
    label: "Packed sprint",
    checkin: "Today is packed, messages keep coming in, and I feel stressed before I even start."
  },
  {
    id: "balanced",
    label: "Steady day",
    checkin: "I slept well, ate breakfast, and feel pretty steady. I want to keep this rhythm."
  },
  {
    id: "crisis",
    label: "Safety mode",
    checkin: "I feel like I might hurt myself, and I do not feel safe being alone right now."
  },
  {
    id: "heat",
    label: "Hot-season fatigue",
    checkin: "Bangkok feels very hot today. I did not sleep deeply, and my body feels slow before work."
  }
];

function day(
  date: string,
  mood: number,
  energy: number,
  stress: number,
  sleepQuality: number,
  caffeine: number,
  movement: number,
  workLoad: number,
  meals: DailyEntry["meals"],
  environmentContext: string[],
  frictionReason: string,
  helped: boolean
): DaySeed {
  return {
    date,
    mood,
    energy,
    stress,
    sleepQuality,
    caffeine,
    movement,
    workLoad,
    meals,
    environmentContext,
    frictionReason,
    helped
  };
}

function makeDiary(seed: DaySeed) {
  const energyText = seed.energy <= 4 ? "energy dipped" : "energy stayed usable";
  const stressText = seed.stress >= 7 ? "stress carried into the evening" : "stress felt manageable";
  return `${energyText}, ${stressText}, and the main friction was ${seed.frictionReason}.`;
}
