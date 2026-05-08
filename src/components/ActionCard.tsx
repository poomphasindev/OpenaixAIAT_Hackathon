import { AlertTriangle, CheckCircle2, HelpCircle, RotateCcw } from "lucide-react";
import type { Feedback, Recommendation } from "@/lib/types";
import { SignalPill } from "./SignalPill";

type ActionCardProps = {
  recommendation: Recommendation;
  feedback: Feedback;
  onFeedback: (feedback: Feedback) => void;
};

export function ActionCard({ recommendation, feedback, onFeedback }: ActionCardProps) {
  const crisis = recommendation.safetyState === "crisis";

  return (
    <section className={`rounded-lg border p-4 shadow-soft ${crisis ? "border-coral bg-white" : "border-ink/10 bg-white"}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-1 rounded-full p-2 ${crisis ? "bg-coral/15 text-coral" : "bg-mint text-moss"}`}>
          {crisis ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-moss">{crisis ? "Safety first" : "Today card"}</p>
          <h2 className="mt-1 text-xl font-semibold leading-tight text-ink">{recommendation.summary}</h2>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-lg bg-mint/70 p-3">
          <p className="text-xs font-semibold uppercase text-moss">Primary action</p>
          <p className="mt-1 text-sm leading-6 text-ink">{recommendation.primaryAction}</p>
        </div>
        <div className="rounded-lg bg-skywash p-3">
          <p className="text-xs font-semibold uppercase text-moss">Backup</p>
          <p className="mt-1 text-sm leading-6 text-ink">{recommendation.backupAction}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <HelpCircle size={16} />
          Why this suggestion?
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {recommendation.whySignals.map((signal) => (
            <SignalPill key={signal} label={signal} />
          ))}
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-ink/10 p-3 text-sm text-ink">{recommendation.followUpQuestion}</p>

      {!crisis && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-ink/70">Was this useful?</p>
          <div className="flex gap-2">
            <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${feedback === "yes" ? "bg-leaf text-white" : "bg-mint text-moss"}`}
              onClick={() => onFeedback("yes")}
            >
              Yes
            </button>
            <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${feedback === "no" ? "bg-coral text-white" : "bg-skywash text-moss"}`}
              onClick={() => onFeedback("no")}
            >
              No
            </button>
            <button className="rounded-lg bg-paper p-2 text-moss" aria-label="Clear feedback" onClick={() => onFeedback(null)}>
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
