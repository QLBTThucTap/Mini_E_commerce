const CATEGORY_LABELS = {
  laptop: "Laptops",
  phone: "Điện thoại",
  headphone: "Tai nghe",
  keyboard: "Bàn phím",
  mouse: "Chuột",
};

export default function ActiveFilterChips({
  selectedCategory = "all",
  onRemoveCategory,
  minPrice = "",
  onRemoveMinPrice,
  maxPrice = "",
  onRemoveMaxPrice,
  searchQuery = "",
  onRemoveSearch,
  onResetAll,
}) {
  const hasCategory = selectedCategory && selectedCategory !== "all";
  const hasMin = minPrice !== "" && minPrice !== undefined;
  const hasMax = maxPrice !== "" && maxPrice !== undefined;
  const hasSearch = Boolean(searchQuery);

  const hasAnyFilter = hasCategory || hasMin || hasMax || hasSearch;

  if (!hasAnyFilter) return null;

  const categoryLabel =
    CATEGORY_LABELS[selectedCategory] ||
    selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs pt-1 pb-2">
      <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
        <i className="fa-solid fa-filter text-emerald-600 text-[10px]" />
        <span>Bộ lọc:</span>
      </span>

      {/* Category chip */}
      {hasCategory && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
          <span>Danh mục: {categoryLabel}</span>
          <button
            type="button"
            onClick={onRemoveCategory}
            className="hover:text-red-600 transition-colors cursor-pointer text-slate-400 hover:scale-110"
            title="Xóa bộ lọc danh mục"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </span>
      )}

      {/* Min Price chip */}
      {hasMin && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
          <span>Min: ${minPrice}</span>
          <button
            type="button"
            onClick={onRemoveMinPrice}
            className="hover:text-red-600 transition-colors cursor-pointer text-slate-400 hover:scale-110"
            title="Xóa bộ lọc giá tối thiểu"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </span>
      )}

      {/* Max Price chip */}
      {hasMax && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
          <span>Max: ${maxPrice}</span>
          <button
            type="button"
            onClick={onRemoveMaxPrice}
            className="hover:text-red-600 transition-colors cursor-pointer text-slate-400 hover:scale-110"
            title="Xóa bộ lọc giá tối đa"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </span>
      )}

      {/* Search keyword chip */}
      {hasSearch && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
          <span>Tìm: "{searchQuery}"</span>
          <button
            type="button"
            onClick={onRemoveSearch}
            className="hover:text-red-600 transition-colors cursor-pointer text-slate-400 hover:scale-110"
            title="Xóa từ khóa tìm kiếm"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </span>
      )}

      {/* Reset all button */}
      <button
        type="button"
        onClick={onResetAll}
        className="text-slate-500 hover:text-red-600 font-bold underline transition-colors cursor-pointer ml-1 text-[11px]"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
