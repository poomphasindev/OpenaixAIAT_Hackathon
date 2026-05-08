"use client";

import { ShieldCheck, Sparkles } from "lucide-react";
import type { Recommendation } from "@/lib/types";

interface ChatBubbleProps {
  from: "ai" | "user";
  text: string;
  senderName?: string;
  inlineRec?: Recommendation;
}

export function ChatBubble({ from, text, senderName, inlineRec }: ChatBubbleProps) {
  const isUser = from === "user";

  return (
    <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
      {senderName && !isUser && (
        <span className="ml-1 text-[10px] font-black uppercase tracking-[0.14em] text-ink/40">
          {senderName}
        </span>
      )}
      <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"}>
        <p className="text-sm leading-6">{text}</p>
      </div>

      {inlineRec && (
        <div
          className={`w-[90%] mt-1 rounded-2xl overflow-hidden border ${
            inlineRec.safetyState === "crisis"
              ? "border-coral/30 bg-rose-50"
              : "border-white/80 bg-white/90"
          }`}
          style={{ boxShadow: "0 4px 18px rgba(23,32,29,0.08)" }}
        >
          {/* Header */}
          <div
            className={`flex items-center gap-2 px-4 py-3 ${
              inlineRec.safetyState === "crisis"
                ? "bg-coral/15"
                : "bg-mint/50"
            }`}
          >
            <div
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl ${
                inlineRec.safetyState === "crisis" ? "bg-coral text-white" : "bg-ink text-white"
              }`}
            >
              {inlineRec.safetyState === "crisis" ? <ShieldCheck size={14} /> : <Sparkles size={14} />}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/60">
              {inlineRec.safetyState === "crisis" ? "Safety first" : "Today plan"}
            </p>
          </div>

          {/* Summary */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-sm font-black leading-snug text-ink">{inlineRec.summary}</p>
          </div>

          {/* Actions */}
          <div className="px-4 pb-3 space-y-2">
            <div className="rounded-xl bg-mint/70 px-3 py-2">
              <p className="text-[10px] font-black uppercase text-moss">Primary</p>
              <p className="mt-0.5 text-xs font-semibold leading-5 text-ink">{inlineRec.primaryAction}</p>
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2">
              <p className="text-[10px] font-black uppercase text-moss">Backup</p>
              <p className="mt-0.5 text-xs font-semibold leading-5 text-ink">{inlineRec.backupAction}</p>
            </div>
          </div>

          {/* Signals */}
          <div className="px-4 pb-3 flex flex-wrap gap-1">
            {inlineRec.whySignals.slice(0, 3).map((sig) => (
              <span
                key={sig}
                className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-ink/60"
                style={{ boxShadow: "0 1px 6px rgba(23,32,29,0.08)" }}
              >
                {sig}
              </span>
            ))}
          </div>

          {/* Follow-up */}
          <div className="px-4 pb-4">
            <p className="text-xs italic text-ink/55">{inlineRec.followUpQuestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
