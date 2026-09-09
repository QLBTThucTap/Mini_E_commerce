import { forwardRef } from "react";

/**
 * Standard text input, meant to be spread with react-hook-form's `register`.
 * icon: Font Awesome class string, e.g. "fa-solid fa-envelope"
 * Usage: <Input label="Email" icon="fa-solid fa-envelope" error={errors.email?.message} {...register("email")} />
 */
const Input = forwardRef(function Input(
  { label, error, icon, className = "", id, ...props },
  ref,
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <i
            className={`${icon} text-sm text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2`}
          />
        )}
        <input
          ref={ref}
          id={id}
          className={[
            "w-full rounded-xl border bg-white text-sm text-slate-800",
            "placeholder-slate-400 px-3.5 py-2.5 focus:outline-none focus:ring-2",
            icon && "pl-10",
            error
              ? "border-red-400 focus:ring-red-500/30"
              : "border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-500",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
