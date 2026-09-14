import { useEffect } from "react";
import ProductFilterSidebar from "./ProductFilterSidebar";

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onApplyPriceFilter,
  onResetAll,
}) {
  // Khóa scroll body khi Drawer đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-slate-50 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
        {/* Drawer header */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-filter text-emerald-600 text-sm" />
            <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
              Bộ lọc sản phẩm
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 flex-1">
          <ProductFilterSidebar
            key={`mobile-${minPrice}-${maxPrice}-${selectedCategory}`}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApplyPriceFilter={onApplyPriceFilter}
            onResetAll={onResetAll}
            onCloseMobile={onClose}
          />
        </div>
      </div>
    </div>
  );
}
