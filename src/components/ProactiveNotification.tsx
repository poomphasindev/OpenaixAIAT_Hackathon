"use client";

import { BellRing, Check, X } from "lucide-react";
import type { DemoNotification } from "@/lib/types";

const TONE: Record<DemoNotification["type"], string> = {
  proactive: "border-moss/20 bg-mint/75 text-moss",
  reactive: "border-sky-100 bg-sky-50 text-ink",
  alert: "border-coral/24 bg-peach/60 text-coral",
  celebration: "border-lilac bg-lilac/55 text-ink"
};

export function ProactiveNotification({ notification, onDismiss }: { notification: DemoNotification; onDismiss?: () => void }) {
  return (
    <article className={`proactive-toast ${TONE[notification.type]}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/75">
          <BellRing size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-70">RoutineSense</p>
              <h4 className="text-sm font-black text-ink">{notification.title}</h4>
            </div>
            <span className="text-[10px] font-black text-ink/42">{notification.timestamp}</span>
          </div>
          <p className="mt-1 text-xs font-bold leading-5 text-ink/62">{notification.body}</p>
          <div className="mt-3 flex gap-2">
            {notification.action && (
              <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-black text-white">
                <Check size={11} className="inline" /> {notification.action}
              </button>
            )}
            <button className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-ink/55 shadow-sm" onClick={onDismiss}>
              <X size={11} className="inline" /> ปิด
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
