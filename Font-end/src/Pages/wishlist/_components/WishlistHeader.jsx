import Button from "../../../Components/ui/Button";

export default function WishlistHeader({
  count = 0,
  summary,
  searchTerm = "",
  onSearchChange,
  sortBy = "default",
  onSortChange,
  onAddAllToCart,
  onClearAll,
}) {
  return (
    <div className="space-y-4">
      {/* Top Main Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl border border-rose-100">
            <i className="fa-solid fa-heart" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Danh Sách Yêu Thích
              </h1>
              <span className="bg-rose-100 text-rose-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {count}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lưu lại những sản phẩm công nghệ bạn quan tâm để mua sắm thuận tiện bất kỳ lúc nào.
            </p>
          </div>
        </div>

        {count > 0 && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <Button
              variant="primary"
              size="sm"
              icon="fa-solid fa-cart-arrow-down"
              onClick={onAddAllToCart}
              className="flex-1 sm:flex-initial whitespace-nowrap cursor-pointer shadow-sm shadow-emerald-600/20"
            >
              Thêm tất cả vào giỏ
            </Button>
            <button
              type="button"
              onClick={onClearAll}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <i className="fa-regular fa-trash-can" />
              <span>Xóa tất cả</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter & Sort Bar (shown only when items exist) */}
      {count > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200/80 text-xs">
          {/* Search in Wishlist */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm trong danh sách yêu thích..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <i className="fa-solid fa-magnifying-glass text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            )}
          </div>

          {/* Sort & Summary */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            {summary && (
              <span className="text-slate-500 font-medium hidden md:inline">
                Tổng giá trị ước tính:{" "}
                <strong className="text-emerald-700 font-bold">
                  {summary.formattedTotalPrice}
                </strong>
              </span>
            )}

            <div className="flex items-center gap-2">
              <label className="text-slate-500 font-semibold whitespace-nowrap">
                Sắp xếp:
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="default">Mới thêm</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="name_asc">Tên: A-Z</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
