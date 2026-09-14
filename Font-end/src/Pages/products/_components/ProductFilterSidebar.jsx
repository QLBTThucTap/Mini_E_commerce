import { useState } from "react";
import Card from "../../../Components/ui/Card";
import Button from "../../../Components/ui/Button";

const CATEGORY_LABELS = {
  laptop: "Laptops",
  phone: "Điện thoại / Smartphone",
  headphone: "Tai nghe & Âm thanh",
  keyboard: "Bàn phím cơ",
  mouse: "Chuột & Phụ kiện",
};

export default function ProductFilterSidebar({
  categories = [],
  selectedCategory = "all",
  onSelectCategory,
  minPrice = "",
  maxPrice = "",
  onApplyPriceFilter,
  onResetAll,
  className = "",
  onCloseMobile,
}) {
  // Local state cho form nhập giá (được reset thông qua key ở component cha khi prop thay đổi)
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [priceError, setPriceError] = useState("");

  const handleMinChange = (e) => {
    const val = e.target.value;
    setLocalMin(val);
    if (priceError) setPriceError("");
  };

  const handleMaxChange = (e) => {
    const val = e.target.value;
    setLocalMax(val);
    if (priceError) setPriceError("");
  };

  const handleApply = (e) => {
    e.preventDefault();

    const min = localMin.trim();
    const max = localMax.trim();

    // 1. Kiểm tra giá âm
    if (min !== "" && Number(min) < 0) {
      setPriceError("Giá tối thiểu không được là số âm.");
      return;
    }
    if (max !== "" && Number(max) < 0) {
      setPriceError("Giá tối đa không được là số âm.");
      return;
    }

    // 2. Kiểm tra Min > Max
    if (min !== "" && max !== "" && Number(min) > Number(max)) {
      setPriceError("Giá tối thiểu không được lớn hơn giá tối đa.");
      return;
    }

    setPriceError("");
    onApplyPriceFilter(min, max);
    if (onCloseMobile) onCloseMobile();
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    setPriceError("");
    onResetAll();
    if (onCloseMobile) onCloseMobile();
  };

  const hasActiveFilter =
    selectedCategory !== "all" || minPrice !== "" || maxPrice !== "";

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Khối Categories */}
      <Card padding="p-5" className="shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-list-ul text-emerald-600 text-sm" />
            <span>Danh mục sản phẩm</span>
          </h3>
          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Xem tất cả
            </button>
          )}
        </div>

        <ul className="space-y-1.5 text-xs">
          {/* Lựa chọn Tất cả */}
          <li>
            <button
              type="button"
              onClick={() => {
                onSelectCategory("all");
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors font-semibold text-left cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <i
                  className={`fa-regular ${
                    selectedCategory === "all"
                      ? "fa-circle-dot text-emerald-600"
                      : "fa-circle text-slate-300"
                  }`}
                />
                <span>Tất cả danh mục</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">All</span>
            </button>
          </li>

          {/* Danh sách danh mục động từ API */}
          {categories.map((catKey) => {
            const isSelected = selectedCategory === catKey;
            const label =
              CATEGORY_LABELS[catKey] ||
              catKey.charAt(0).toUpperCase() + catKey.slice(1);

            return (
              <li key={catKey}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory(catKey);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors font-semibold text-left cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <i
                      className={`fa-regular ${
                        isSelected
                          ? "fa-circle-dot text-emerald-600"
                          : "fa-circle text-slate-300"
                      }`}
                    />
                    <span className="capitalize">{label}</span>
                  </span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300" />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Khối Bộ lọc Giá (Price Filter) */}
      <Card padding="p-5" className="shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-emerald-600 text-sm" />
            <span>Khoảng giá (USD)</span>
          </h3>
          {(minPrice !== "" || maxPrice !== "") && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>

        <form onSubmit={handleApply} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="price-min"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Tối thiểu ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  id="price-min"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={localMin}
                  onChange={handleMinChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-2 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="price-max"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Tối đa ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  id="price-max"
                  type="number"
                  min="0"
                  placeholder="10000"
                  value={localMax}
                  onChange={handleMaxChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-2 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Price Suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { label: "< $100", min: "", max: "100" },
              { label: "$100 - $500", min: "100", max: "500" },
              { label: "$500 - $1000", min: "500", max: "1000" },
              { label: "> $1000", min: "1000", max: "" },
            ].map((range) => (
              <button
                key={range.label}
                type="button"
                onClick={() => {
                  setLocalMin(range.min);
                  setLocalMax(range.max);
                  setPriceError("");
                }}
                className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Thông báo lỗi validation */}
          {priceError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-[11px] font-semibold flex items-start gap-1.5">
              <i className="fa-solid fa-circle-exclamation mt-0.5 text-xs text-red-500 shrink-0" />
              <span>{priceError}</span>
            </div>
          )}

          {/* Nút Áp dụng & Đặt lại */}
          <div className="space-y-2 pt-1">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="w-full justify-center shadow-xs"
              icon="fa-solid fa-filter"
              iconPosition="left"
            >
              Áp dụng bộ lọc
            </Button>

            {hasActiveFilter && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleReset}
                icon="fa-solid fa-rotate-left"
                iconPosition="left"
              >
                Đặt lại tất cả
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
