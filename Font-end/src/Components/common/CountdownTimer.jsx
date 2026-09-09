/**
 * Purely presentational — pass pre-computed { days, hours, minutes, seconds }.
 * Compute the remaining time in the parent (e.g. via a useCountdown hook).
 */
const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

export default function CountdownTimer({ value, label = "Promotion expires in:" }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="flex items-center gap-3">
        {UNITS.map((unit) => (
          <div
            key={unit.key}
            className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center leading-none"
          >
            <span className="text-lg font-black text-slate-900">
              {String(value?.[unit.key] ?? 0).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-1">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
