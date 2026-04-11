type Props = {
  label: string;
  value: string | number;
  sub?: string;
  valueClassName?: string;
};

export function AdminStatCard({ label, value, sub, valueClassName }: Props) {
  return (
    <div className="rounded-2xl border border-[#E2E0D9] bg-white p-4 shadow-sm">
      <div className="text-[11px] font-medium uppercase tracking-wide text-[#9A9890]">{label}</div>
      <div className={`mt-1 text-[26px] font-bold leading-tight text-[#1A1917] ${valueClassName ?? ""}`}>{value}</div>
      {sub ? <div className="mt-1 text-xs text-[#5C5A55]">{sub}</div> : null}
    </div>
  );
}
