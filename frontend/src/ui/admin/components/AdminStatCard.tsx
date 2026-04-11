type Props = {
  label: string;
  value: string | number;
  sub?: string;
  valueClassName?: string;
};

export function AdminStatCard({ label, value, sub, valueClassName }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--pw-border)] bg-white p-4 shadow-sm">
      <div className="text-[11px] font-medium uppercase tracking-wide text-[var(--pw-text-muted)]">{label}</div>
      <div className={`mt-1 text-[26px] font-bold leading-tight text-[var(--pw-text)] ${valueClassName ?? ""}`}>{value}</div>
      {sub ? <div className="mt-1 text-xs text-[var(--pw-text-secondary)]">{sub}</div> : null}
    </div>
  );
}
