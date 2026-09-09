import { forwardRef } from "react";
/**
 * Design tokens: emerald = brand accent, slate-900 = dark/inverted variant.
 * variant: "primary" | "dark" | "outline" | "ghost" | "danger"
 * size: "sm" | "md" | "lg"
 * icon: Font Awesome class string, e.g. "fa-solid fa-arrow-right"
 */

const VARIANT_CLASSES = {
  primary:
    "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
  outline:
    "bg-white text-slate-800 border border-slate-200 hover: border-emerald-500 hover: text-emerald-600 ",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZE_CLASSES = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "right",
    isLoading = false,
    disabled = false,
    className = "",
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold",
        "transition-all disabled: opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-50000/40",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ].join(" ")}
      {...props}
    >
      {isLoading && (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
      )}
      {!isLoading && icon && iconPosition === "left" && (
        <i className={`${icon} text-sm`} />
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === "right" && (
        <i className={`${icon} text-sm`} />
      )}
    </button>
  );
});
export default Button;
