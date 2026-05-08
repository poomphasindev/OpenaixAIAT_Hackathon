import type { PatternMemory } from "@/lib/types";

type MemoryReviewProps = {
  patterns: PatternMemory[];
};

export function MemoryReview({ patterns }: MemoryReviewProps) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-moss">7-day starter memory</p>
          <h2 className="text-xl font-semibold text-ink">Patterns to confirm</h2>
        </div>
        <span className="rounded-full bg-sun/25 px-3 py-1 text-xs font-semibold text-ink">not diagnosis</span>
      </div>
      <div className="mt-4 grid gap-3">
        {patterns.map((pattern) => (
          <article key={pattern.id} className="rounded-lg border border-ink/10 bg-paper p-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">{pattern.label}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-moss">{pattern.confidence}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/75">{pattern.evidence}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
