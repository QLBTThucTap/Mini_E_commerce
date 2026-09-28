/**
 * Shared Export Invoice Button Component
 * Styling: Yellow bg #FACC15, black text, hover #EAB308, muted when disabled.
 *
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.isLoading=false] - Loading spinner state
 * @param {number} [props.count=0] - Number of selected orders to display
 * @param {string} [props.tooltip=""] - Tooltip text shown when hovered while disabled
 * @param {string} [props.className=""] - Extra CSS classes
 * @param {React.ReactNode} [props.children] - Custom label text
 */
export default function ExportInvoiceButton({
  onClick,
  disabled = false,
  isLoading = false,
  count = 0,
  tooltip = "",
  className = "",
  children,
  type = "button",
}) {
  const label =
    children || (count > 0 ? `Xuất hóa đơn (${count})` : "Xuất hóa đơn");

  return (
    <div className="relative inline-block group">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`rounded-lg bg-[#FACC15] px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-[#EAB308] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FACC15] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs ${className}`}
      >
        {isLoading ? (
          <i className="fa-solid fa-spinner fa-spin" />
        ) : (
          <i className="fa-solid fa-file-invoice text-slate-900 text-sm" />
        )}
        <span>{isLoading ? "Đang xuất..." : label}</span>
      </button>

      {disabled && tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
          <div className="bg-slate-800 text-white text-xs font-semibold rounded px-2.5 py-1 shadow-md whitespace-nowrap">
            {tooltip}
          </div>
          <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}
