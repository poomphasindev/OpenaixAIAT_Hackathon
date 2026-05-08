import type { DailyEntry, LumaScore, LumaScoreInput, LumaState, PatternMemory, Recommendation } from "@/lib/types";

const crisisSignals = [
  "hurt myself",
  "kill myself",
  "suicide",
  "end my life",
  "not safe",
  "harm myself",
  "ทำร้ายตัวเอง",
  "อยากตาย",
  "ไม่อยากอยู่",
  "ไม่รู้สึกปลอดภัย",
  "ไม่ปลอดภัย"
];

export function hasCrisisLanguage(text: string) {
  const normalized = text.toLowerCase();
  return crisisSignals.some((signal) => normalized.includes(signal));
}

export function extractState(text: string): DailyEntry {
  const normalized = text.toLowerCase();
  const hasAny = (terms: string[]) => terms.some((term) => normalized.includes(term));
  const sleepQuality = hasAny(["slept well", "นอนดี"])
    ? 8
    : hasAny(["badly", "five hours", "late", "นอนน้อย", "ห้าชั่วโมง", "นอนดึก", "หลับไม่ลึก", "ดึก"])
      ? 3
      : 6;
  const caffeine = hasAny(["coffee", "caffeine", "กาแฟ"]) ? 3 : 1;
  const workLoad = hasAny(["packed", "messages", "calendar", "ตารางแน่น", "ข้อความ", "ประชุม", "sprint"]) ? 9 : 5;
  const stress = workLoad > 7 || hasAny(["tense", "เครียด", "ล้า"]) ? 8 : hasAny(["steady", "นิ่ง"]) ? 3 : 5;
  const energy = hasAny(["low energy", "หมดแรง", "พลังต่ำ", "ร่างกายช้า"]) || sleepQuality < 5 ? 3 : hasAny(["steady", "นิ่ง"]) ? 7 : 5;
  const environmentContext = [
    hasAny(["air", "aqi", "ฝุ่น", "อากาศ"]) ? "high AQI" : "",
    hasAny(["hot", "heat", "ร้อน"]) ? "hot season" : "",
    hasAny(["screen", "calendar", "จอ", "ตาราง"]) ? "screen-heavy" : ""
  ].filter(Boolean);

  return {
    id: `live-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    moment: "morning",
    rawText: text,
    mood: hasAny(["well", "steady", "นอนดี", "นิ่ง"]) ? 7 : 5,
    energy,
    stress,
    sleepQuality,
    caffeine,
    meals: hasAny(["breakfast", "มื้อเช้า", "กิน"]) ? "regular" : "light",
    movement: hasAny(["walk", "เดิน", "ขยับ"]) ? 25 : 8,
    workLoad,
    socialLoad: normalized.includes("messages") ? 7 : 3,
    environmentContext,
    frictionReason: detectFriction(normalized),
    tomorrowIntent: "protect a steadier rhythm",
    helpRequest: detectHelpRequest(normalized)
  };
}

export function buildPatterns(entries: DailyEntry[]): PatternMemory[] {
  const recent = entries.slice(-7);
  const lowSleepLowEnergy = recent.filter((entry) => entry.sleepQuality <= 5 && entry.energy <= 4);
  const caffeineLoop = recent.filter((entry) => entry.caffeine >= 3 && entry.sleepQuality <= 4);
  const overload = recent.filter((entry) => entry.workLoad >= 8 && entry.stress >= 7);
  const movementHelps = recent.filter((entry) => entry.movement >= 25 && entry.energy >= 7);

  return [
    {
      id: "sleep-energy",
      label: "การนอนช่วยกันพลังตกช่วงบ่าย",
      evidence: `7 วันที่ผ่านมา นอนน้อยจับคู่กับพลังต่ำ ${lowSleepLowEnergy.length} ครั้ง ข้อนี้ตรงกับคุณไหม`,
      confidence: confidenceFromCount(lowSleepLowEnergy.length),
      confirmation: "unconfirmed"
    },
    {
      id: "caffeine-loop",
      label: "กาแฟช่วงท้ายวันอาจอยู่ในวงจรพลังตก",
      evidence: `7 วันที่ผ่านมา กาแฟสูงและนอนแย่เกิดคู่กัน ${caffeineLoop.length} ครั้ง เป็นข้อสังเกตแรก ๆ ยังไม่ใช่ข้อสรุป`,
      confidence: confidenceFromCount(caffeineLoop.length),
      confirmation: "unconfirmed"
    },
    {
      id: "workload-carryover",
      label: "วันที่ข้อความเยอะพาความเครียดข้ามวัน",
      evidence: `7 วันที่ผ่านมา งานแน่นและความเครียดสูงเกิดพร้อมกัน ${overload.length} ครั้ง`,
      confidence: confidenceFromCount(overload.length),
      confirmation: "unconfirmed"
    },
    {
      id: "movement-buffer",
      label: "การขยับเบา ๆ ช่วยให้พลังนิ่งขึ้น",
      evidence: `7 วันที่ผ่านมา วันที่ขยับเกิน 25 นาทีมักพลังดีกว่า ${movementHelps.length} ครั้ง`,
      confidence: confidenceFromCount(movementHelps.length),
      confirmation: "unconfirmed"
    }
  ];
}

export function calculateLumaScore(data: LumaScoreInput): LumaScore {
  const sleepScore = Math.min((data.sleepHours / 8) * 30, 30);
  const aqiScore = data.aqi < 50 ? 25 : data.aqi < 100 ? 20 : data.aqi < 150 ? 16 : 10;
  const energyScore = data.energyBead * 5;
  const stressScore = (10 - data.stress) * 2;
  const total = Math.max(0, Math.min(100, Math.round(sleepScore + aqiScore + energyScore + stressScore)));

  const tone = total >= 80 ? "flow" : total >= 60 ? "friction" : total >= 40 ? "recovery" : "sos";

  return {
    score: total,
    label: tone === "flow" ? "ลื่นไหล" : tone === "friction" ? "พลังงานติดขัด" : tone === "recovery" ? "ควรพักฟื้น" : "ดูแลตัวเองด่วน",
    color: tone === "flow" ? "text-emerald-600" : tone === "friction" ? "text-amber-600" : tone === "recovery" ? "text-orange-600" : "text-rose-600",
    tone,
    trend: total - data.lastWeekScore,
    primaryFactors: deriveFactors(data)
  };
}

export function determineLumaState(data: LumaScoreInput & { streak: number; followedPlan?: boolean; hour?: number }): LumaState {
  const hour = data.hour ?? 9;

  if (data.aqi >= 140 && data.sleepHours <= 5) {
    return {
      mood: "concerned",
      message: `วันนี้กรุงเทพฯ หนัก และคุณนอน ${data.sleepHours} ชม. Luma เลยอยากให้เบาแผนลง`,
      animation: "luma-mood-concerned",
      particleEffect: "amber-pulse",
      suggestion: "ปิดหน้าต่าง กินก่อนเที่ยง และขยับตัวในอาคาร"
    };
  }

  if (data.followedPlan) {
    return {
      mood: "proud",
      message: "คุณทำตามแผนได้ Luma เห็นความพยายามตรงนี้",
      animation: "luma-mood-proud",
      particleEffect: "soft-glow",
      suggestion: "ทำขั้นต่อไปให้เล็กและทำซ้ำได้"
    };
  }

  if (data.streak >= 7 && data.aqi < 150 && data.sleepHours >= 5) {
    return {
      mood: "celebrating",
      message: `ต่อเนื่อง ${data.streak} วันแล้ว Luma เริ่มรู้จังหวะคุณดีขึ้น`,
      animation: "luma-mood-celebrating",
      particleEffect: "confetti-subtle",
      suggestion: "ฉลองด้วยการรีเซ็ตเล็ก ๆ ที่ไม่กดดันตัวเอง"
    };
  }

  if (hour >= 23) {
    return {
      mood: "sleepy",
      message: "ถึงเวลาช่วยให้พรุ่งนี้เริ่มง่ายขึ้น",
      animation: "luma-mood-sleepy",
      particleEffect: "fade-drift",
      suggestion: "ลดแสงจอและจอดงานถัดไปไว้ก่อน"
    };
  }

  if (data.stress >= 8) {
    return {
      mood: "anxious",
      message: "โหลดวันนี้ดูสูง Luma จะทำแผนให้เล็กลง",
      animation: "luma-mood-concerned",
      particleEffect: "amber-pulse",
      suggestion: "กันเวลา 25 นาทีหนึ่งช่วง และมื้ออาหารจริงหนึ่งมื้อ"
    };
  }

  return {
    mood: "happy",
    message: "วันนี้จังหวะยังพอใช้งานได้",
    animation: "luma-mood-happy",
    particleEffect: "green-sparkles",
    suggestion: "ใช้ช่วงที่ดีที่สุดทำงานลึก แล้วหยุดก่อนพลังตก"
  };
}

export function createRecommendation(entry: DailyEntry, history: DailyEntry[]): Recommendation {
  if (hasCrisisLanguage(entry.rawText)) {
    return {
      safetyState: "crisis",
      summary: "ข้อความนี้สำคัญกว่าแผน wellness ปกติ ต้องให้ความปลอดภัยมาก่อน",
      primaryAction: "ติดต่อคนที่ไว้ใจได้ตอนนี้ หรือบริการฉุกเฉินในพื้นที่ถ้าคุณอาจทำตามความรู้สึกนี้",
      backupAction: "ขยับไปอยู่ใกล้คนอื่นหรือพื้นที่ที่ปลอดภัยกว่า ระหว่างติดต่อขอความช่วยเหลือ",
      whySignals: ["คุณบอกว่าอาจไม่ปลอดภัย", "ควรพัก routine planning เมื่อมีความเสี่ยงฉับพลัน"],
      followUpQuestion: "ตอนนี้คุณติดต่อคนที่ไว้ใจหรือหน่วยช่วยเหลือฉุกเฉินได้ไหม"
    };
  }

  const patterns = buildPatterns([...history, entry]);
  const highAqi = entry.environmentContext.includes("high AQI");
  const lowSleep = entry.sleepQuality <= 5;
  const overloaded = entry.workLoad >= 8;
  const caffeineLoop = entry.caffeine >= 3 && lowSleep;

  if (lowSleep && highAqi) {
    return normalRecommendation(
      "AQI กรุงเทพฯ + นอนน้อย ทำให้วันนี้ควรใช้แผนแบบฟื้นตัว",
      "ปิดหน้าต่าง เลื่อนวิ่งกลางแจ้ง และยืดเหยียดในห้อง 10 นาทีก่อนเที่ยง",
      "ถ้าขยับตัวยังไม่ไหว ให้ทำ work block ถัดไปสั้นลงและกินก่อน 12:00",
      ["นอนน้อย", "AQI กรุงเทพฯ สูง", findEvidence(patterns, "sleep-energy")],
      "วันนี้มีงานไหนที่ทำให้เบาลงได้หนึ่งอย่าง"
    );
  }

  if (caffeineLoop) {
    return normalRecommendation(
      "พลังวันนี้ค่อนข้างเปราะ และกาแฟเพิ่มอาจทำให้วงจรพลังตกซ้ำ",
      "ตั้งเวลาหยุดกาแฟที่ 15:00 แล้วจับคู่ work block ถัดไปกับน้ำและของว่างจริง",
      "ถ้าโฟกัสตก ให้รีเซ็ต 7 นาทีก่อนเติมกาแฟ",
      ["นอนน้อย", "กาแฟสูง", findEvidence(patterns, "caffeine-loop")],
      "หยุดกาแฟ 15:00 วันนี้พอเป็นไปได้ไหม"
    );
  }

  if (overloaded) {
    return normalRecommendation(
      "สัญญาณหลักคือโหลด ไม่ใช่แรงใจ วันนี้ต้องมีขอบเขตชัด ๆ",
      "กันเวลาโฟกัส 25 นาทีหนึ่งช่วง และกันมื้อเที่ยงจริงก่อนตอบข้อความที่ไม่เร่งด่วน",
      "ถ้าย้ายตารางไม่ได้ ให้ส่งข้อความตั้ง expectation สั้น ๆ หนึ่งข้อความ",
      ["งานโหลดสูง", "เครียดสูง", findEvidence(patterns, "workload-carryover")],
      "ช่วงไหนควรเป็นเวลาที่กันไว้ก่อน"
    );
  }

  return normalRecommendation(
    "วันนี้คุณค่อนข้างนิ่ง เป้าหมายคือรักษาจังหวะที่กำลังดีไว้",
    "รักษา anchor ที่เริ่มเวิร์กอยู่แล้ว: เวลากิน การขยับตัว หรือกาแฟน้อยลง",
    "ถ้าวันเริ่มยุ่ง ให้กลับมารีเซ็ตด้วยการขยับในห้อง 10 นาที",
    ["พลังนิ่ง", "เครียดต่ำลง", findEvidence(patterns, "movement-buffer")],
    "วันนี้อยากรักษา anchor ไหนก่อน"
  );
}

function normalRecommendation(
  summary: string,
  primaryAction: string,
  backupAction: string,
  whySignals: string[],
  followUpQuestion: string
): Recommendation {
  return {
    safetyState: "normal",
    summary,
    primaryAction,
    backupAction,
    whySignals,
    followUpQuestion
  };
}

function confidenceFromCount(count: number) {
  if (count >= 3) return "high";
  if (count >= 2) return "medium";
  return "low";
}

function deriveFactors(data: LumaScoreInput) {
  const factors: string[] = [];
  if (data.sleepHours < 6) factors.push("การนอน");
  if (data.aqi >= 100) factors.push("AQI");
  if (data.energyBead <= 3) factors.push("พลังงาน");
  if (data.stress >= 7) factors.push("ความเครียด");
  if ((data.caffeine ?? 0) >= 3) factors.push("กาแฟ");
  if ((data.heatIndex ?? 0) >= 38) factors.push("ความร้อน");
  return factors.length > 0 ? factors.slice(0, 3) : ["จังหวะชีวิต"];
}

function findEvidence(patterns: PatternMemory[], id: string) {
  return patterns.find((pattern) => pattern.id === id)?.evidence ?? "ความจำ 7 วันยังอยู่ระหว่างเรียนรู้";
}

function detectFriction(text: string) {
  if (text.includes("air") || text.includes("aqi") || text.includes("ฝุ่น") || text.includes("อากาศ")) return "คุณภาพอากาศไม่ดี";
  if (text.includes("hot") || text.includes("heat") || text.includes("ร้อน")) return "ล้าจากอากาศร้อน";
  if (text.includes("coffee") || text.includes("caffeine") || text.includes("กาแฟ")) return "วงจรกาแฟกับการนอน";
  if (text.includes("packed") || text.includes("messages") || text.includes("ตารางแน่น") || text.includes("ข้อความ")) return "งานแน่นเกินไป";
  if (text.includes("badly") || text.includes("late") || text.includes("นอนน้อย") || text.includes("ดึก")) return "นอนน้อย";
  return "ยังไม่ได้ระบุ";
}

function detectHelpRequest(text: string) {
  if (text.includes("focus") || text.includes("โฟกัส")) return "โฟกัสโดยไม่พลังตก";
  if (text.includes("steady") || text.includes("rhythm") || text.includes("นิ่ง") || text.includes("จังหวะ")) return "รักษาจังหวะที่ดี";
  if (text.includes("tense") || text.includes("เครียด")) return "ลดความเครียดค้าง";
  return "ทำให้ช่วงถัดไปของวันง่ายขึ้น";
}
