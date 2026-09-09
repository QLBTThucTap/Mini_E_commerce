/**
 * Circular action button used for: wishlist heart, carousel prev/next,
 * social icons, avatar trigger.
 * icon: Font Awesome class string, e.g. "fa-solid fa-heart"
 * variant: "subtle" (slate-100 bg) | "outline" (bordered) | "solid" (emerald)
 */
const VARIANT_CLASSES = {
  subtle: "bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white",
  outline: "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100",
  solid:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white",
};

const SIZE_CLASSES = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-10 h-10 text-base",
};

export default function IconButton({
  icon,
  variant = "subtle",
  size = "md",
  as: Tag = "button",
  className = "",
  ...props
}) {
  const extraProps = Tag === "button" ? { type: "button" } : {};
  return (
    <Tag
      className={[
        "rounded-full flex items-center justify-center transition-colors",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ].join(" ")}
      {...extraProps}
      {...props}
    >
      <i className={icon} />
    </Tag>
  );
}
