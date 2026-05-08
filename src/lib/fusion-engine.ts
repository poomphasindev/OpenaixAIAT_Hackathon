import { mockCalendar, todayContext } from "@/data/seed";
import type { CalendarEvent, ContextLayer, DailyEntry, ExternalContext, IntelligenceOutput, Language, RiskLevel } from "@/lib/types";
import { hasCrisisLanguage } from "@/lib/wellness";

type BuildContextInput = {
  entry: DailyEntry;
  diary: string;
  energy: number;
  language: Language;
  externalContext: ExternalContext | null;
  events?: CalendarEvent[];
};

export function buildContextLayer({
  entry,
  diary,
  energy,
  language,
  externalContext,
  events = mockCalendar
}: BuildContextInput): ContextLayer {
  const weather = externalContext ?? {
    location: todayContext.location,
    aqi: todayContext.aqi,
    pm25: 52,
    temperature: todayContext.temperature,
    heatIndex: todayContext.heatIndex,
    humidity: todayContext.humidity,
    condition: "hazy"
  };

  const heavyEvents = events.filter((event) => event.energyImpact === "high" || event.type === "deadline");
  const intensity = heavyEvents.length >= 2
    ? "sprint"
    : events.length >= 4
      ? "heavy"
      : events.length >= 2
        ? "moderate"
        : "light";

  return {
    weather: {
      temperature: weather.temperature,
      humidity: weather.humidity,
      aqi: weather.aqi,
      pm25: weather.pm25,
      uvIndex: 11,
      condition: weather.condition,
      location: weather.location,
      heatIndex: weather.heatIndex
    },
    calendar: {
      events,
      intensity,
      freeBlocks: [
        { start: "12:00", end: "12:25", label: language === "th" ? "มื้อเที่ยงกันพลังตก" : "Protected lunch" },
        { start: "14:45", end: "15:00", label: language === "th" ? "รีเซ็ตในห้อง" : "Indoor reset" }
      ]
    },
    user: {
      sleep: {
        hours: todayContext.sleepHours,
        quality: entry.sleepQuality,
        bedtime: entry.sleepQuality <= 4 ? "02:30" : "23:40"
      },
      energy,
      mood: Math.max(1, Math.min(5, Math.round(entry.mood / 2))),
      stress: entry.stress,
      diary,
      lastCheckIn: new Date().toISOString(),
      language
    }
  };
}

export function fuseIntelligence(ctx: ContextLayer): IntelligenceOutput {
  let riskScore = 14;
  const trail: string[] = [];

  if (hasCrisisLanguage(ctx.user.diary)) {
    riskScore = 92;
    trail.push("Safety language detected: pause wellness planning and prioritize support");
  }

  if (ctx.weather.aqi > 150) {
    riskScore += 18;
    trail.push(ctx.user.language === "th"
      ? `AQI ${ctx.weather.aqi}: ออกกลางแจ้งมีต้นทุนพลังงานสูงกว่าปกติ`
      : `Air: AQI ${ctx.weather.aqi} makes outdoor plans cost more energy today`);
  } else if (ctx.weather.aqi > 100) {
    riskScore += 14;
    trail.push(ctx.user.language === "th"
      ? `AQI ${ctx.weather.aqi}: แผนในอาคารเบากว่าและปลอดภัยกับพลังงานกว่า`
      : `Air: AQI ${ctx.weather.aqi} points to a lighter indoor plan`);
  }

  if (ctx.weather.heatIndex > 38) {
    riskScore += 8;
    trail.push(ctx.user.language === "th"
      ? `Heat index ${ctx.weather.heatIndex}C: ช่วงบ่ายร่างกายฟื้นตัวยากขึ้น`
      : `Heat: feels like ${ctx.weather.heatIndex}°C, so recovery gets harder later`);
  }

  if (ctx.user.sleep.hours < 5) {
    riskScore += 18;
    trail.push(ctx.user.language === "th"
      ? `Sleep ${ctx.user.sleep.hours}h: ต่ำกว่าฐานฟื้นตัวของวันนี้`
      : `Sleep: ${ctx.user.sleep.hours}h is below your recovery baseline`);
  } else if (ctx.user.sleep.hours < 6) {
    riskScore += 14;
    trail.push(ctx.user.language === "th"
      ? `Sleep ${ctx.user.sleep.hours}h: คืนสั้น ควรกัน margin ช่วงบ่าย`
      : `Sleep: ${ctx.user.sleep.hours}h is a short night, so afternoon margin matters`);
  }

  const highLoadEvents = ctx.calendar.events.filter((event) => event.energyImpact === "high" || event.type === "deadline");
  if (ctx.calendar.intensity === "sprint") {
    riskScore += 10;
    trail.push(ctx.user.language === "th"
      ? `${highLoadEvents.length} งานใช้พลังสูง: วันนี้เป็นจังหวะ sprint`
      : `Calendar: ${highLoadEvents.length} high-load events, a sprint rhythm`);
  } else if (ctx.calendar.intensity === "heavy") {
    riskScore += 6;
    trail.push(ctx.user.language === "th"
      ? `${ctx.calendar.events.length} events: ตารางวันนี้ไม่เบา`
      : `Calendar: ${ctx.calendar.events.length} events leaves fewer natural recovery gaps`);
  }

  riskScore += Math.max(0, 5 - ctx.user.energy) * 4;
  riskScore += Math.max(0, ctx.user.stress - 5) * 2;

  if (ctx.user.energy <= 3) {
    trail.push(ctx.user.language === "th"
      ? `Energy ${ctx.user.energy}/5: ขั้นต่อไปควรเล็กพอเริ่มได้`
      : `Energy: ${ctx.user.energy}/5 means the next action should be small enough to start`);
  }
  if (ctx.user.stress >= 7) {
    trail.push(ctx.user.language === "th"
      ? `Stress ${ctx.user.stress}/10: ลดจำนวน decision ที่ต้องคิดเอง`
      : `Stress: ${ctx.user.stress}/10, so the plan should reduce decisions`);
  }

  const boundedRisk = Math.max(0, Math.min(100, Math.round(riskScore)));
  const riskLevel = getRiskLevel(boundedRisk);
  const prediction = predictCrash(ctx, boundedRisk);
  const recommendation = generateRecommendation(ctx, riskLevel);

  return {
    riskLevel,
    riskScore: boundedRisk,
    prediction,
    recommendation,
    scheduleAdjustment: {
      suggestReschedule: ctx.weather.aqi >= 120 || ctx.user.energy <= 3,
      movedEvents: ctx.weather.aqi >= 120 ? ctx.calendar.events.filter((event) => event.type === "exercise") : [],
      addedRecovery: ctx.calendar.freeBlocks[1]
    },
    reasoningTrail: trail,
    briefing: generateBriefing(ctx, riskLevel, prediction)
  };
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "sos";
  if (score >= 60) return "recovery";
  if (score >= 40) return "friction";
  return "flow";
}

function predictCrash(ctx: ContextLayer, riskScore: number) {
  if (riskScore < 38) {
    return {
      confidence: 58,
      reasoning: ctx.user.language === "th"
        ? "สัญญาณวันนี้ยังนิ่ง ไม่มี crash pattern ชัด"
        : "Signals are steady; I do not see a strong afternoon-dip pattern yet"
    };
  }

  const crashTime = ctx.user.sleep.hours <= 5 || ctx.calendar.intensity !== "light" ? "15:00" : "16:30";
  const confidence = Math.min(92, Math.max(64, riskScore + 8));

  return {
    crashTime,
    confidence,
    reasoning: ctx.user.language === "th"
      ? `นอน ${ctx.user.sleep.hours} ชม. + AQI ${ctx.weather.aqi} + ตาราง ${ctx.calendar.intensity} คล้ายวันที่พลังตกช่วงบ่าย`
      : `${ctx.user.sleep.hours}h sleep, AQI ${ctx.weather.aqi}, and a ${ctx.calendar.intensity} calendar resemble past afternoon dips`
  };
}

function generateRecommendation(ctx: ContextLayer, riskLevel: RiskLevel) {
  if (ctx.user.language === "th") {
    if (riskLevel === "sos") {
      return {
        primary: "หยุดแผน productivity ก่อน แล้วติดต่อคนที่ไว้ใจได้หรือสายด่วน 1323 ถ้ารู้สึกไม่ปลอดภัย",
        alternatives: ["อยู่ใกล้คนอื่น", "ย้ายไปพื้นที่ปลอดภัย", "ลดสิ่งกระตุ้นตรงหน้า"],
        timing: "ตอนนี้"
      };
    }

    if (ctx.weather.aqi >= 120 && ctx.user.sleep.hours <= 5) {
      return {
        primary: "ปิดหน้าต่าง กินก่อน 12:00 และยืดในห้อง 10 นาทีก่อนบ่าย",
        alternatives: ["ลด work block ถัดไปเหลือ 25 นาที", "ย้ายยิมเป็นพรุ่งนี้", "ตั้งเตือนพักตอน 14:45"],
        timing: "ก่อน 12:00"
      };
    }

    return {
      primary: "ใช้ช่วงพลังดีที่สุดทำงานสำคัญหนึ่งอย่าง แล้วเว้นช่องพักก่อนบ่าย",
      alternatives: ["ขยับในห้อง 7 นาที", "จบกาแฟก่อน 14:00", "กันมื้ออาหารจริงหนึ่งมื้อ"],
      timing: "ช่วง 10:00-12:00"
    };
  }

  if (riskLevel === "sos") {
    return {
      primary: "Pause productivity planning and contact someone you trust or emergency support if you feel unsafe.",
      alternatives: ["Move near another person", "Go to a safer space", "Reduce immediate triggers"],
      timing: "Now"
    };
  }

  if (ctx.weather.aqi >= 120 && ctx.user.sleep.hours <= 5) {
    return {
      primary: "Close the windows, eat before noon, and make movement a 10-minute indoor reset.",
      alternatives: ["Make the next work block 25 minutes", "Move outdoor exercise to tomorrow", "Set a 14:45 recovery reminder"],
      timing: "Before 12:00"
    };
  }

  return {
    primary: "Use your best energy window for one important task, then protect a short recovery gap.",
    alternatives: ["Move indoors for 7 minutes", "Finish caffeine before 14:00", "Anchor one real meal"],
    timing: "10:00-12:00"
  };
}

function generateBriefing(ctx: ContextLayer, riskLevel: RiskLevel, prediction: IntelligenceOutput["prediction"]) {
  if (ctx.user.language === "th") {
    if (riskLevel === "flow") {
      return `อรุณสวัสดิ์ Beam วันนี้สัญญาณค่อนข้างนิ่ง AQI ${ctx.weather.aqi} และตารางยังพอจัดการได้ ผมว่าใช้ช่วงเช้าทำงานหลักหนึ่งอย่างแล้วรักษาจังหวะนี้ไว้`;
    }

    return `สวัสดีตอนเช้า Beam วันนี้กรุงเทพฯ ฝุ่นหนัก AQI ${ctx.weather.aqi} เธอนอน ${ctx.user.sleep.hours} ชั่วโมง และมีตาราง ${ctx.calendar.events.length} อย่าง ผมเลยจัดแผนเบา ๆ ไว้กันพลังตก${prediction.crashTime ? `ช่วง ${prediction.crashTime}` : ""}`;
  }

  if (riskLevel === "flow") {
    return `Morning, Beam. Today looks workable: AQI ${ctx.weather.aqi}, a manageable calendar, and enough room for one useful focus block.`;
  }

  return `Morning, Beam. Bangkok is asking for a softer day: AQI ${ctx.weather.aqi}, ${ctx.user.sleep.hours}h sleep, and ${ctx.calendar.events.length} things on your calendar. I’d protect lunch and keep movement indoors${prediction.crashTime ? ` before the ${prediction.crashTime} dip` : ""}.`;
}
