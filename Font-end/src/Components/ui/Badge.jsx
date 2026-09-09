/**
 * tone: "new" | "sale" | "success" | "danger" | "warning" | "neutral"
 * Used for: product NEW/SAVE tags, FREE SHIPPING pill, FREE GIFT pill,
 * membership/promo pills.
 */

const TONE_CLASSES = {
  new: "bg-slate-900 text-white",
  sale: "bg-emerald-600 text-white",
  discount: "bg-red-500 text-white",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  danger: "bg-red-50 text-red-600 border border-red-200",
  warning: "bg-amber-50 text-amber-600 border border-amber-200",
  neutral: "bg-slate-50 text-slate-600 border border-slate-200",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
        TONE_CLASSES[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
