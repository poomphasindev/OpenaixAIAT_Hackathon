type SignalPillProps = {
  label: string;
};

export function SignalPill({ label }: SignalPillProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-medium text-ink">
      {label}
    </span>
  );
}
