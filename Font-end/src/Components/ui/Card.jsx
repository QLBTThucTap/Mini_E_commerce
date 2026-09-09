/**
 * The single "white rounded bordered box" used everywhere: product cards,
 * section containers, promo tiles. Keeps radius/border/shadow consistent.
 */

export default function Card({
  as: Tag = "div",
  hoverable = false,
  padding = "p-4",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={[
        "bg-white rounded-2xl border border-slate-200",
        padding,
        hoverable && "transition-all hover:shadow-lg hover:border-emerald-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
