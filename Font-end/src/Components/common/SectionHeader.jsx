import IconButton from "../ui/IconButton";

/**
 * Reused at the top of every product/category section on Home, Category
 * listing, Account order history, Admin tables, etc.
 */
export default function SectionHeader({
  title,
  viewAllHref,
  onViewAll,
  onPrev,
  onNext,
  bordered = true,
  className = "",
}) {
  return (
    <div
      className={[
        "flex items-center justify-between",
        bordered && "border-b border-slate-200 pb-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex items-center gap-3">
        {(viewAllHref || onViewAll) && (
          <a
            href={viewAllHref ?? "#"}
            onClick={onViewAll}
            className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            View All
          </a>
        )}
        {(onPrev || onNext) && (
          <div className="flex gap-1.5">
            <IconButton icon="fa-solid fa-chevron-left" variant="outline" size="sm" onClick={onPrev} />
            <IconButton icon="fa-solid fa-chevron-right" variant="outline" size="sm" onClick={onNext} />
          </div>
        )}
      </div>
    </div>
  );
}
