import { Link } from "react-router-dom";

/**
 * Reusable Breadcrumb Component
 * Unified UI styling based on standard design:
 * - Background: bg-[#eff4ff]
 * - Border: border-b border-slate-200/80
 * - Max width: max-w-[1360px]
 * - House icon: fa-solid fa-house text-xs
 * - Separator: fa-solid fa-chevron-right text-[10px] text-slate-400
 *
 * @param {Object} props
 * @param {Array<{label: string|React.ReactNode, to?: string, className?: string}>} props.items - Breadcrumb items after Home link.
 * @param {string} [props.homeLabel="Trang chủ"] - Label text for Home link.
 * @param {string} [props.homeTo="/"] - Path for Home link.
 * @param {React.ReactNode} [props.rightContent] - Optional content aligned on the right side (e.g. product count, SKU).
 * @param {string} [props.className=""] - Additional CSS class names for outer nav element.
 */
export default function Breadcrumb({
  items = [],
  homeLabel = "Trang chủ",
  homeTo = "/",
  rightContent = null,
  className = "",
}) {
  return (
    <nav
      className={`w-full bg-[#eff4ff] border-b border-slate-200/80 py-3 ${className}`}
    >
      <div className="max-w-[1360px] mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={homeTo}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1.5 text-slate-600"
          >
            <i className="fa-solid fa-house text-xs" />
            <span>{homeLabel}</span>
          </Link>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <div key={index} className="flex items-center gap-2">
                <i className="fa-solid fa-chevron-right text-[10px] text-slate-400 select-none" />
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className={`hover:text-emerald-600 transition-colors text-slate-600 ${
                      item.className || ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`text-slate-900 font-bold ${
                      item.className || ""
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {rightContent && <div>{rightContent}</div>}
      </div>
    </nav>
  );
}
