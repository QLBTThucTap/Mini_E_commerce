import WishlistItemCard from "./WishlistItemCard";

export default function WishlistGrid({
  items = [],
  addedItemIds = new Set(),
  onAddToCart,
  onRemove,
  onResetSearch,
}) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-4">
        <i className="fa-solid fa-magnifying-glass text-3xl text-slate-300 mb-2 block" />
        <p className="text-sm font-bold text-slate-700">
          Không tìm thấy sản phẩm nào khớp với tìm kiếm
        </p>
        {onResetSearch && (
          <button
            type="button"
            onClick={onResetSearch}
            className="mt-3 text-xs text-emerald-600 hover:text-emerald-700 font-bold underline cursor-pointer"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((item) => (
        <WishlistItemCard
          key={item.id}
          item={item}
          isAdded={addedItemIds.has(item.id)}
          onAddToCart={onAddToCart}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
