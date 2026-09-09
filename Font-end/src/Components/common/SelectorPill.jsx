export default function SelectorPill({ label, icon, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "border border-slate-200 rounded-xl px-3.5 py-2 flex items-center gap-2",
        "text-xs font-bold text-slate-700 hover:border-emerald-500 bg-white transition-colors",
        className,
      ].join(" ")}
    >
      {icon && <i className={icon} />}
      <span>{label}</span>
      <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" />
    </button>
  );
}
