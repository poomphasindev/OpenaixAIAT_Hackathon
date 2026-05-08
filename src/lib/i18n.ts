import type { Language } from "@/lib/types";

export const wellnessCopy = {
  en: {
    localData: "All data stays on this device.",
    safety: "RoutineSense is a wellness copilot, not medical care."
  },
  th: {
    localData: "ข้อมูลเดโมทั้งหมดอยู่บนอุปกรณ์นี้",
    safety: "RoutineSense เป็นผู้ช่วยด้าน wellbeing ไม่ใช่บริการทางการแพทย์"
  }
};

export const navCopy: Record<Language, Record<string, string>> = {
  th: {
    now: "วันนี้",
    talk: "คุย",
    you: "คุณ"
  },
  en: {
    now: "Now",
    talk: "Talk",
    you: "You"
  }
};

export function pickCopy<T>(language: Language, copy: Record<Language, T>): T {
  return copy[language] ?? copy.en;
}
