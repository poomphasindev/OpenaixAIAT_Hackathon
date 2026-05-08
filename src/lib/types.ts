export type Moment = "morning" | "afternoon" | "evening";
export type SafetyState = "normal" | "crisis";
export type Feedback = "yes" | "no" | "unsure" | null;

export type DailyEntry = {
  id: string;
  date: string;
  moment: Moment;
  rawText: string;
  mood: number;
  energy: number;
  stress: number;
  sleepQuality: number;
  caffeine: number;
  meals: "regular" | "light" | "skipped" | "late";
  movement: number;
  workLoad: number;
  socialLoad: number;
  environmentContext: string[];
  frictionReason: string;
  tomorrowIntent: string;
  helpRequest: string;
  recommendationHelped?: boolean;
};

export type PatternMemory = {
  id: string;
  label: string;
  evidence: string;
  confidence: "low" | "medium" | "high";
  confirmation: "unconfirmed" | "confirmed" | "dismissed";
};

export type Recommendation = {
  safetyState: SafetyState;
  summary: string;
  primaryAction: string;
  backupAction: string;
  whySignals: string[];
  followUpQuestion: string;
};

export type Scenario = {
  id: string;
  label: string;
  checkin: string;
};

export type LumaMood =
  | "calm"
  | "happy"
  | "concerned"
  | "celebrating"
  | "sleepy"
  | "anxious"
  | "proud"
  | "confused"
  | "alert"
  | "thinking";

export type LumaScore = {
  score: number;
  label: "ลื่นไหล" | "พลังงานติดขัด" | "ควรพักฟื้น" | "ดูแลตัวเองด่วน";
  color: string;
  tone: "flow" | "friction" | "recovery" | "sos";
  trend: number;
  primaryFactors: string[];
};

export type LumaScoreInput = {
  sleepHours: number;
  aqi: number;
  energyBead: number;
  stress: number;
  lastWeekScore: number;
  caffeine?: number;
  heatIndex?: number;
};

export type LumaState = {
  mood: LumaMood;
  message: string;
  animation: string;
  particleEffect: string;
  suggestion: string;
};

export type EnergyForecastSlot = {
  time: string;
  status: "optimal" | "stable" | "declining" | "crash" | "recovery";
  confidence: number;
  recommendation: string;
};

export type EnergyForecast = {
  timeSlots: EnergyForecastSlot[];
  summary: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  type: "work" | "social" | "exercise" | "meal" | "commute" | "deadline";
  startTime: string;
  endTime: string;
  energyImpact: "high" | "medium" | "low" | "recovery";
  lumaNote?: string;
};

export type DemoNotification = {
  id: string;
  type: "proactive" | "reactive" | "alert" | "celebration";
  title: string;
  body: string;
  timestamp: string;
  action?: string;
};

export type WeeklyLetterHighlight = {
  type: "win" | "challenge" | "pattern" | "surprise";
  title: string;
  description: string;
  date?: string;
};

export type WeeklyLetter = {
  weekNumber: number;
  daysLogged: number;
  opening: string;
  highlights: WeeklyLetterHighlight[];
  lumaInsight: string;
  recommendation: string;
  closing: string;
  thaiContext?: string;
};

export type HiddenPattern = {
  id: string;
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  status: "hidden" | "revealed" | "confirmed" | "dismissed";
  reward: string;
};

export type AiDecisionLog = {
  id: string;
  text: string;
  kind: "input" | "rule" | "pattern" | "recommendation";
};

export type PitchPoint = {
  id: string;
  label: string;
  done: boolean;
};
