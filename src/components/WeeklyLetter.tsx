"use client";

import { Archive, Mail, MessageCircle, Send, Sparkles } from "lucide-react";
import type { Language, WeeklyLetter as WeeklyLetterType } from "@/lib/types";

const HIGHLIGHT_STYLE: Record<WeeklyLetterType["highlights"][number]["type"], string> = {
  win: "bg-mint text-moss",
  challenge: "bg-peach text-coral",
  pattern: "bg-lilac text-ink",
  surprise: "bg-sky-50 text-ink"
};

const COPY: Record<Language, { eyebrow: string; week: string; logged: string; suggestion: string; share: string; archive: string; reply: string }> = {
  en: {
    eyebrow: "Luma's letter",
    week: "Week",
    logged: "days logged",
    suggestion: "Luma suggests",
    share: "Share",
    archive: "Archive",
    reply: "Reply"
  },
  th: {
    eyebrow: "จดหมายจาก Luma",
    week: "สัปดาห์ที่",
    logged: "วัน",
    suggestion: "Luma แนะนำ",
    share: "แชร์",
    archive: "เก็บ",
    reply: "ตอบ"
  }
};

export function WeeklyLetter({ letter, language = "en" }: { letter: WeeklyLetterType; language?: Language }) {
  const copy = COPY[language];
  return (
    <section className="weekly-letter app-panel">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.eyebrow}</p>
          <h3 className="text-lg font-black text-ink">{copy.week} {letter.weekNumber}</h3>
          <p className="text-xs font-bold text-ink/45">{letter.daysLogged}/7 {copy.logged}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white">
          <Mail size={17} />
        </span>
      </div>

      <p className="whitespace-pre-line text-sm font-bold leading-6 text-ink/74">{letter.opening}</p>

      <div className="mt-4 space-y-2">
        {letter.highlights.map((highlight) => (
          <article key={highlight.title} className="rounded-2xl bg-white/72 p-3 shadow-sm">
            <div className="mb-1 flex items-center gap-2">
              <span className={`grid h-7 w-7 place-items-center rounded-xl ${HIGHLIGHT_STYLE[highlight.type]}`}>
                <Sparkles size={13} />
              </span>
              <h4 className="text-sm font-black text-ink">{highlight.title}</h4>
            </div>
            <p className="text-xs font-semibold leading-5 text-ink/58">{highlight.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-mint/65 p-3">
        <p className="text-[10px] font-black uppercase tracking-wide text-moss">{copy.suggestion}</p>
        <p className="mt-1 text-sm font-black leading-5 text-ink">{letter.recommendation}</p>
      </div>

      {letter.thaiContext && (
        <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs font-bold leading-5 text-ink/56">{letter.thaiContext}</p>
      )}

      <p className="mt-4 whitespace-pre-line text-sm font-bold leading-6 text-ink/70">{letter.closing}</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button className="rounded-2xl bg-ink px-2 py-2.5 text-xs font-black text-white"><Send size={13} className="mx-auto" />{copy.share}</button>
        <button className="rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-ink/62 shadow-sm"><Archive size={13} className="mx-auto" />{copy.archive}</button>
        <button className="rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-ink/62 shadow-sm"><MessageCircle size={13} className="mx-auto" />{copy.reply}</button>
      </div>
    </section>
  );
}
