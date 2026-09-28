import { useEffect, createElement as h } from "react";

/**
 * Reusable Modal Component
 * @param {Object} props
 * @param {boolean} [props.isOpen=true] - Modal visibility state
 * @param {boolean} [props.show] - Alias for isOpen
 * @param {string|React.ReactNode} [props.title] - Modal header title
 * @param {string|React.ReactNode} [props.subtitle] - Modal header subtitle
 * @param {Function} [props.onClose] - Callback fired when closing modal (Esc key, backdrop click, or close button)
 * @param {string} [props.size="lg"] - Modal size: "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"
 * @param {React.ReactNode} props.children - Content inside modal
 * @param {string} [props.className=""] - Additional CSS classes for modal body container
 * @param {string} [props.overlayClassName=""] - Additional CSS classes for backdrop overlay
 * @param {boolean} [props.showCloseButton=true] - Whether to show top-right X close button
 */
export function Modal({
  isOpen = true,
  show,
  title,
  subtitle,
  onClose,
  size = "lg",
  children,
  className = "",
  overlayClassName = "",
  showCloseButton = true,
}) {
  const visible = show !== undefined ? show : isOpen;

  // Handle ESC key press to close modal
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.code === "Escape") {
        if (onClose) onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  const maxWidthClass =
    sizeClasses[size] ||
    (typeof size === "string" && size.startsWith("max-w-")
      ? size
      : sizeClasses.lg);

  // Close modal when backdrop overlay is clicked directly
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (onClose) onClose();
    }
  };

  const headerContent = [];
  if (title) {
    if (typeof title === "string") {
      headerContent.push(
        h("h2", { key: "title", className: "text-xl font-extrabold text-slate-900" }, title)
      );
    } else {
      headerContent.push(title);
    }
  }
  if (subtitle) {
    if (typeof subtitle === "string") {
      headerContent.push(
        h("p", { key: "subtitle", className: "mt-1 text-xs text-slate-500" }, subtitle)
      );
    } else {
      headerContent.push(subtitle);
    }
  }

  const header = (title || (showCloseButton && onClose))
    ? h(
        "div",
        { className: "flex items-center justify-between border-b border-slate-100 pb-4 mb-4" },
        h("div", null, ...headerContent),
        showCloseButton && onClose
          ? h(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors",
                "aria-label": "Đóng",
              },
              h("i", { className: "fa-solid fa-xmark text-lg" })
            )
          : null
      )
    : null;

  return h(
    "div",
    {
      className: `fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 ${overlayClassName}`,
      onClick: handleBackdropClick,
    },
    h(
      "div",
      {
        className: `w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${className}`,
        onClick: (e) => e.stopPropagation(),
      },
      header,
      children
    )
  );
}

export default Modal;
