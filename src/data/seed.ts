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
  city: "กรุงเทพฯ",
  streak: 15,
  joinedDaysAgo: 31,
  goal: "รักษาพลังให้คงที่ช่วง hackathon",
  persona: "student builder ที่เขียนโค้ดดึก ดื่มกาแฟ และอยากมี routine ที่ใจดีกับตัวเองขึ้น"
};

export const todayContext = {
  location: "กรุงเทพฯ",
  aqi: 145,
  temperature: 34,
  heatIndex: 41,
  sleepHours: 5,
  humidity: 66,
  commuteLoad: "medium",
  headline: "วันนี้อากาศกรุงเทพฯ หนักกว่าปกติ",
  recommendation: "ปิดหน้าต่าง เลื่อนวิ่งกลางแจ้ง และยืดเหยียดในห้อง 10 นาทีก่อนเที่ยง",
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
    { time: "08:00", status: "stable", confidence: 90, recommendation: "เริ่มด้วยงานเบา" },
    { time: "10:00", status: "optimal", confidence: 85, recommendation: "ช่วงทำงานลึก" },
    { time: "12:00", status: "declining", confidence: 75, recommendation: "กินก่อนหิวจัด" },
    { time: "15:00", status: "crash", confidence: 80, recommendation: "ยืดเหยียดในห้อง งดกาแฟเพิ่ม" },
    { time: "17:00", status: "recovery", confidence: 70, recommendation: "งานเบา/อ่านสั้น ๆ" },
    { time: "20:00", status: "stable", confidence: 65, recommendation: "เตรียมพรุ่งนี้ ลดแสงจอ" }
  ],
  summary: "คาดว่าพลังจะตกช่วง 15:00 จากการนอน 5 ชม. + AQI 145"
};

export const mockCalendar: CalendarEvent[] = [
  {
    id: "cal-commute",
    title: "เดินทางด้วย BTS",
    type: "commute",
    startTime: "2026-05-09T08:30:00",
    endTime: "2026-05-09T09:15:00",
    energyImpact: "medium",
    lumaNote: "วันนี้ AQI 145 ใส่หน้ากากและลดการเดินกลางแจ้ง"
  },
  {
    id: "cal-review",
    title: "Sprint review",
    type: "deadline",
    startTime: "2026-05-09T10:00:00",
    endTime: "2026-05-09T11:30:00",
    energyImpact: "high",
    lumaNote: "ช่วงใช้พลังสูง กินมื้อเช้าก่อนเริ่ม"
  },
  {
    id: "cal-lunch",
    title: "มื้อเที่ยงกันพลังตก",
    type: "meal",
    startTime: "2026-05-09T12:00:00",
    endTime: "2026-05-09T12:30:00",
    energyImpact: "recovery",
    lumaNote: "กันไว้ก่อนช่วงพลังตกประมาณ 15:00"
  },
  {
    id: "cal-family",
    title: "มื้อเย็นกับครอบครัว",
    type: "social",
    startTime: "2026-05-09T19:00:00",
    endTime: "2026-05-09T21:00:00",
    energyImpact: "recovery",
    lumaNote: "เป็นช่วงเติมพลังทางใจ อย่าเพิ่งตัดออกเป็นอย่างแรก"
  }
];

export const demoNotifications: DemoNotification[] = [
  {
    id: "n1",
    type: "proactive",
    title: "สรุปเช้านี้",
    body: "วันนี้ AQI 145 Luma เลื่อนวิ่งกลางแจ้งเป็นยืดเหยียดในห้อง",
    timestamp: "08:00",
    action: "ดูแผน"
  },
  {
    id: "n2",
    type: "alert",
    title: "คาดว่าพลังจะตก",
    body: "จากการนอน + AQI วันนี้ คุณอาจหมดแรงช่วง 15:00 กินก่อน 12:00",
    timestamp: "11:30",
    action: "ตั้งเตือน"
  },
  {
    id: "n3",
    type: "celebration",
    title: "เช็คอินครบ 7 วัน",
    body: "คุณบันทึกครบ 7 วัน Luma เจอ 3 pattern ใหม่ ลองอ่านจดหมายสรุป",
    timestamp: "20:00",
    action: "อ่านสรุป"
  },
  {
    id: "n4",
    type: "proactive",
    title: "ถึงเวลาลดจอ",
    body: "พรุ่งนี้มี sprint review นอนก่อน 23:30 จะเริ่มวันได้ง่ายขึ้น",
    timestamp: "22:00",
    action: "ตั้งปลุก"
  }
];

export const weeklyLetter: WeeklyLetter = {
  weekNumber: 3,
  daysLogged: 7,
  opening: "สวัสดี Beam,\n\nอาทิตย์นี้คุณส่งมา 7 วันเต็ม — Luma อยากเล่าให้ฟัง:",
  highlights: [
    {
      type: "win",
      title: "วันที่ดีที่สุด: 7 พ.ค.",
      description: "นอน 7 ชม. ขยับตัวในห้อง และกาแฟเบาลง วันนี้คุณใกล้จังหวะลื่นไหล"
    },
    {
      type: "challenge",
      title: "วันที่หนักสุด: 8 พ.ค.",
      description: "AQI 145 + นอน 5 ชม. ทำให้วันหนักขึ้น แต่คุณยังเช็คอินได้"
    },
    {
      type: "pattern",
      title: "สิ่งที่เริ่มเห็น",
      description: "กาแฟช่วงบ่ายแก่ ๆ + ใช้จอหนัก มักมาก่อนคืนที่นอนน้อย"
    }
  ],
  lumaInsight: "วันที่พลังตกไม่ได้สุ่มทั้งหมด มักมารวมกับ AQI สูง นอนน้อย และกาแฟช่วงท้ายวัน",
  recommendation: "สัปดาห์หน้า ลองจบกาแฟก่อน 14:00 แล้วดูว่านอนดีขึ้นไหม",
  closing: "ไม่ต้อง perfect นะ Beam — แค่รู้ตัวก็เก่งแล้ว\n\nLuma",
  thaiContext: "AQI กรุงเทพฯ เฉลี่ยสัปดาห์นี้ประมาณ 135 Luma จึงย้ายกิจกรรมกลางแจ้งเป็นช่วงฟื้นตัวในห้อง"
};

export const hiddenPatterns: HiddenPattern[] = [
  {
    id: "hidden-pm25-lunch",
    title: "PM2.5 ทำให้มื้อเที่ยงเลื่อน",
    description: "วันที่ AQI สูง มื้อเที่ยงมักเลื่อนไป 2-3 ชั่วโมง",
    evidence: ["3 พ.ค.: AQI 160, เที่ยง 14:30", "7 พ.ค.: AQI 155, เที่ยง 15:00", "8 พ.ค.: AQI 145, กินเบา"],
    confidence: 85,
    status: "hidden",
    reward: "เจอ pattern เฉพาะชีวิตกรุงเทพฯ แล้ว"
  },
  {
    id: "hidden-caffeine-loop",
    title: "วงจรกาแฟช่วงบ่าย",
    description: "กาแฟหลัง 15:00 มักมาก่อนนอนแย่และต้องพึ่งกาแฟเพิ่ม",
    evidence: ["16 เม.ย.", "27 เม.ย.", "6 พ.ค."],
    confidence: 90,
    status: "revealed",
    reward: "เจอวงจรที่น่าลองตัดแล้ว"
  },
  {
    id: "hidden-family-recharge",
    title: "ช่วงเติมพลังจากคนใกล้ตัว",
    description: "มื้อเย็นกับครอบครัวมักช่วยให้วันถัดไปนิ่งขึ้น ถ้าไม่ต่อด้วย coding ดึก",
    evidence: ["13 เม.ย.", "29 เม.ย.", "7 พ.ค."],
    confidence: 72,
    status: "hidden",
    reward: "เจอ pattern ที่ใจดีกับตัวเองขึ้น"
  }
];

export const aiDecisionLog: AiDecisionLog[] = [
  { id: "log-1", kind: "input", text: "ผู้ใช้เช็คอิน: พลัง 3/5, เครียด 7/10" },
  { id: "log-2", kind: "rule", text: "กฎทำงาน: AQI > 100 ย้ายกิจกรรมกลางแจ้งเป็นในอาคาร" },
  { id: "log-3", kind: "pattern", text: "pattern ตรงกัน: นอน < 6 ชม. + AQI สูง มักมาก่อนพลังตกช่วง 15:00" },
  { id: "log-4", kind: "recommendation", text: "คำแนะนำ: กินก่อน 12:00 + ยืดเหยียดในห้อง 10 นาที" }
];

export const pitchChecklist: PitchPoint[] = [
  { id: "pitch-thai", label: "บริบทไทยชัดตั้งแต่ 3 วินาทีแรก", done: true },
  { id: "pitch-privacy", label: "Privacy by design", done: true },
  { id: "pitch-collab", label: "AI เรียนรู้ร่วมกับผู้ใช้", done: true },
  { id: "pitch-proactive", label: "แจ้งเตือนก่อนพลังตก", done: true },
  { id: "pitch-real-api", label: "ต่อ API จริงหลังใส่ .env", done: false },
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
    label: "เริ่มวันแบบเบา",
    detail: "น้ำ + มื้อเช้าก่อน sprint แรก",
    status: "done"
  },
  {
    time: "12:30",
    label: "ล็อกมื้อเที่ยง",
    detail: "กินให้ห่างจาก laptop สักช่วง",
    status: "next"
  },
  {
    time: "14:30",
    label: "รีเซ็ตแบบเลี่ยงฝุ่น",
    detail: "เดินในห้อง 10 นาที ยังไม่เติมกาแฟ",
    status: "alert"
  },
  {
    time: "21:40",
    label: "ทางลงก่อนนอน",
    detail: "ลดแสงจอและจอด task list ของพรุ่งนี้",
    status: "later"
  }
];

export const coachMessages = [
  {
    from: "RoutineSense",
    text: "Luma เห็น pattern คล้ายวันที่ 5-6 พ.ค.: นอนน้อย, AQI สูง, ใช้จอหนัก วันนี้ขอทำให้แผนเล็กและฟื้นตัวง่ายขึ้น"
  },
  {
    from: "Beam",
    text: "คืนนี้ยังต้อง build ต่อ พักทั้งวันไม่ได้"
  },
  {
    from: "RoutineSense",
    text: "งั้นชัยชนะวันนี้ไม่ใช่การพักทั้งวัน แต่คือกันพลังตกตอน 15:00: กินก่อน ขยับในห้อง และล็อก build block หนึ่งช่วง"
  }
];

export const scenarios: Scenario[] = [
  {
    id: "aqi",
    label: "นอนน้อย + AQI สูง",
    checkin: "เมื่อคืนผมนอนน้อยประมาณห้าชั่วโมง อากาศข้างนอกฝุ่นเยอะ และก่อนเที่ยงก็เริ่มหมดแรงแล้ว"
  },
  {
    id: "caffeine",
    label: "วงจรกาแฟ",
    checkin: "เมื่อวานดื่มกาแฟเยอะแล้วนอนดึกอีก วันนี้อยากโฟกัส แต่ไม่อยากพลังตกซ้ำ"
  },
  {
    id: "overload",
    label: "Sprint แน่น",
    checkin: "วันนี้ตารางแน่น ข้อความเข้าตลอด และยังไม่ทันเริ่มวันก็รู้สึกเครียดแล้ว"
  },
  {
    id: "balanced",
    label: "วันที่ค่อนข้างนิ่ง",
    checkin: "เมื่อคืนผมนอนดี กินมื้อเช้าแล้ว และรู้สึกนิ่งพอสมควร วันนี้อยากรักษาจังหวะนี้ไว้"
  },
  {
    id: "crisis",
    label: "โหมดความปลอดภัย",
    checkin: "ผมรู้สึกว่าอาจทำร้ายตัวเอง และตอนนี้ไม่รู้สึกปลอดภัยถ้าต้องอยู่คนเดียว"
  },
  {
    id: "heat",
    label: "ล้าจากอากาศร้อน",
    checkin: "วันนี้กรุงเทพฯ ร้อนมาก ผมนอนหลับไม่ลึก และร่างกายช้ามากก่อนเริ่มงาน"
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
