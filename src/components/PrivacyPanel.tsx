import { ShieldCheck, Trash2, Volume2 } from "lucide-react";

type PrivacyPanelProps = {
  onClear: () => void;
};

export function PrivacyPanel({ onClear }: PrivacyPanelProps) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-moss" size={20} />
        <h2 className="text-lg font-semibold text-ink">Privacy and safety</h2>
      </div>
      <div className="mt-3 grid gap-2 text-sm leading-6 text-ink/75">
        <p>RoutineSense is a wellness support demo, not diagnosis, therapy, or treatment.</p>
        <p>Raw check-ins stay local in this MVP. Derived signals are used only to explain the next plan.</p>
        <p className="flex items-start gap-2">
          <Volume2 className="mt-1 shrink-0 text-moss" size={16} />
          Voice playback, when enabled, must be disclosed as AI-generated.
        </p>
      </div>
      <button
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white"
        onClick={onClear}
      >
        <Trash2 size={16} />
        Clear memory
      </button>
    </section>
  );
}
