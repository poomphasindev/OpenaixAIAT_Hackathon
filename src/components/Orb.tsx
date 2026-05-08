type OrbProps = {
  state: "calm" | "alert";
};

export function Orb({ state }: OrbProps) {
  const alert = state === "alert";

  return (
    <div
      aria-label={alert ? "Safety attention state" : "RoutineSense companion"}
      className={`relative grid h-24 w-24 place-items-center rounded-full shadow-soft ${
        alert ? "bg-coral" : "bg-leaf"
      }`}
    >
      <div className="absolute inset-3 rounded-full bg-white/30" />
      <div className="relative flex gap-3">
        <span className="h-3 w-3 rounded-full bg-ink" />
        <span className="h-3 w-3 rounded-full bg-ink" />
      </div>
      <div className="absolute bottom-7 h-2 w-8 rounded-full bg-ink/80" />
    </div>
  );
}
