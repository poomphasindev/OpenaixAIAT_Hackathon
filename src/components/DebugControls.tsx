"use client";

import { CloudFog, Moon, RotateCcw, Send, ShieldCheck, Zap } from "lucide-react";
import type { Language } from "@/lib/types";

export type DebugActionId = "aqi" | "sleep" | "crash" | "reset" | "notify" | "safety";

const CONTROLS: Record<Language, Array<{ id: DebugActionId; label: string; detail: string; icon: typeof CloudFog }>> = {
  th: [
    { id: "aqi", label: "จำลอง AQI 200", detail: "Luma ปรับเป็นแผนในอาคาร", icon: CloudFog },
    { id: "sleep", label: "เพิ่มนอน +2 ชม.", detail: "โหลดวันสมดุลขึ้น", icon: Moon },
    { id: "crash", label: "ทดสอบพลังตก", detail: "เปิดแผนกันตกช่วงบ่าย", icon: Zap },
    { id: "safety", label: "ทดสอบ safety", detail: "เปลี่ยนเป็นโหมดช่วยเหลือ", icon: ShieldCheck },
    { id: "notify", label: "ส่งแจ้งเตือน", detail: "โชว์ proactive alert", icon: Send },
    { id: "reset", label: "รีเซ็ต demo", detail: "กลับหน้าแรกข้อมูลหลัก", icon: RotateCcw }
  ],
  en: [
    { id: "aqi", label: "Simulate AQI 200", detail: "Luma switches to indoor care", icon: CloudFog },
    { id: "sleep", label: "Add sleep +2h", detail: "Loads a balanced day", icon: Moon },
    { id: "crash", label: "Test energy crash", detail: "Opens afternoon protection", icon: Zap },
    { id: "safety", label: "Test safety", detail: "Switches to support mode", icon: ShieldCheck },
    { id: "notify", label: "Send alert", detail: "Shows proactive notification", icon: Send },
    { id: "reset", label: "Reset demo", detail: "Returns to main story", icon: RotateCcw }
  ]
};

export function DebugControls({
  language = "th",
  onAction
}: {
  language?: Language;
  onAction?: (id: DebugActionId, label: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CONTROLS[language].map(({ id, label, detail, icon: Icon }) => (
        <button key={id} className="judge-control" onClick={() => onAction?.(id, label)}>
          <Icon size={14} className="shrink-0" />
          <span>
            <span className="block">{label}</span>
            <span className="block text-[9px] font-bold leading-4 text-ink/42">{detail}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
