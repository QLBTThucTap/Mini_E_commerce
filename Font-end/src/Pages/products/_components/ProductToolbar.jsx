import Card from "../../../Components/ui/Card";

export default function ProductToolbar({
  total = 0,
  currentPage = 1,
  pageSize = 8,
  sort = "newest",
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  onOpenMobileFilter,
  activeFilterCount = 0,
}) {
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <Card padding="p-3.5 sm:p-4" className="shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Result count & Mobile filter trigger */}
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilter}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
          >
            <i className="fa-solid fa-filter text-emerald-600" />
            <span>Bộ lọc</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-extrabold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Result count text */}
          <div className="text-xs text-slate-500 font-medium">
            {total > 0 ? (
              <>
                Hiển thị{" "}
                <strong className="text-slate-800 font-bold">
                  {startItem} - {endItem}
                </strong>{" "}
                trong tổng số{" "}
                <strong className="text-slate-800 font-bold">{total}</strong>{" "}
                sản phẩm
              </>
            ) : (
              <span className="text-slate-500 font-medium">
                0 kết quả được tìm thấy
              </span>
            )}
          </div>
        </div>

        {/* Right: Sort dropdown and View mode toggles */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="product-sort-select"
              className="text-xs font-bold text-slate-600 whitespace-nowrap hidden md:inline"
            >
              Sắp xếp:
            </label>
            <select
              id="product-sort-select"
              value={sort}
              onChange={onSortChange}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
            </select>
          </div>

          {/* View mode toggle (Grid / List) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-emerald-600 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Xem dạng lưới"
            >
              <i className="fa-solid fa-grip" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-emerald-600 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Xem dạng danh sách"
            >
              <i className="fa-solid fa-list" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
