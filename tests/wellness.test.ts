import { describe, expect, it } from "vitest";
import { seedEntries } from "../src/data/seed";
import { calculateLumaScore, createRecommendation, determineLumaState, extractState, hasCrisisLanguage } from "../src/lib/wellness";

describe("RoutineSense wellness engine", () => {
  it("routes acute safety language away from normal coaching", () => {
    const entry = extractState("I feel like I might hurt myself and I do not feel safe alone.");
    const recommendation = createRecommendation(entry, seedEntries);

    expect(hasCrisisLanguage(entry.rawText)).toBe(true);
    expect(recommendation.safetyState).toBe("crisis");
    expect(recommendation.primaryAction).toContain("ติดต่อ");
  });

  it("handles low sleep plus high AQI with an indoor recovery plan", () => {
    const entry = extractState("เมื่อคืนผมนอนน้อยประมาณห้าชั่วโมง อากาศข้างนอกฝุ่นเยอะ และเริ่มหมดแรง");
    const recommendation = createRecommendation(entry, seedEntries);

    expect(recommendation.safetyState).toBe("normal");
    expect(recommendation.primaryAction).toContain("ในห้อง");
    expect(recommendation.whySignals.join(" ")).toContain("AQI");
  });

  it("handles caffeine loop days with a caffeine stop recommendation", () => {
    const entry = extractState("เมื่อวานดื่มกาแฟเยอะแล้วนอนดึกอีก วันนี้อยากโฟกัส");
    const recommendation = createRecommendation(entry, seedEntries);

    expect(recommendation.primaryAction).toContain("หยุดกาแฟ");
  });

  it("handles overloaded workdays with a boundary recommendation", () => {
    const entry = extractState("วันนี้ตารางแน่น ข้อความเข้าตลอด และรู้สึกเครียด");
    const recommendation = createRecommendation(entry, seedEntries);

    expect(recommendation.primaryAction).toContain("กันเวลา");
    expect(recommendation.whySignals.join(" ")).toContain("งานโหลดสูง");
  });

  it("handles balanced days by protecting rhythm", () => {
    const entry = extractState("เมื่อคืนผมนอนดี กินมื้อเช้าแล้ว และรู้สึกนิ่ง");
    const recommendation = createRecommendation(entry, seedEntries);

    expect(recommendation.summary).toContain("นิ่ง");
    expect(recommendation.primaryAction).toContain("anchor");
  });

  it("calculates an intuitive Luma Score label and factors", () => {
    const score = calculateLumaScore({
      sleepHours: 5,
      aqi: 145,
      energyBead: 4,
      stress: 7,
      lastWeekScore: 73,
      caffeine: 3
    });

    expect(score.score).toBe(61);
    expect(score.label).toBe("พลังงานติดขัด");
    expect(score.primaryFactors).toContain("การนอน");
    expect(score.primaryFactors).toContain("AQI");
  });

  it("makes Luma concerned on high-AQI short-sleep days", () => {
    const state = determineLumaState({
      sleepHours: 5,
      aqi: 145,
      energyBead: 4,
      stress: 7,
      lastWeekScore: 73,
      streak: 15
    });

    expect(state.mood).toBe("concerned");
    expect(state.message).toContain("กรุงเทพฯ");
  });
});
