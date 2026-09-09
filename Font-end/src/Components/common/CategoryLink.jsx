/**
 * icon: Font Awesome class string, e.g. "fa-solid fa-laptop"
 */
export default function CategoryLink({
  icon,
  label,
  href = "#",
  active = false,
  className = "",
}) {
  return (
    <a
      href={href}
      className={[
        "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors",
        active
          ? "bg-red-50 text-red-600 font-bold hover:bg-red-100"
          : "text-slate-700 font-medium hover:bg-slate-50 hover:text-emerald-600",
        className,
      ].join(" ")}
    >
      <span className="flex items-center gap-2.5">
        {icon && <i className={[icon, "text-sm", active ? "" : "text-slate-400"].join(" ")} />}
        {label}
      </span>
      <i className={["fa-solid fa-chevron-right text-xs", active ? "text-red-400" : "text-slate-400"].join(" ")} />
    </a>
  );
}
