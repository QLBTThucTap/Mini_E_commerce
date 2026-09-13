import { useNavigate } from "react-router-dom";
import Card from "../../../Components/ui/Card";
import Button from "../../../Components/ui/Button";
import Badge from "../../../Components/ui/Badge";
import PriceTag from "../../../Components/ui/PriceTag";
import StockStatus from "../../../Components/ui/StockStatus";
import RatingStars from "../../../Components/ui/RatingStars";

export default function WishlistItemCard({
  item,
  isAdded,
  onAddToCart,
  onRemove,
}) {
  const navigate = useNavigate();

  const ratingValue = Math.round(item.rating?.rate ?? 5);
  const ratingCount = item.rating?.count ?? 0;

  return (
    <Card
      hoverable
      className="flex flex-col justify-between group h-full relative border border-slate-200 bg-white"
    >
      {/* Remove Button on Top-Right */}
      <button
        type="button"
        onClick={() => onRemove(item)}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-500 shadow-sm border border-slate-100 flex items-center justify-center transition-all cursor-pointer group/btn"
        title="Xóa khỏi yêu thích"
      >
        <i className="fa-solid fa-xmark text-sm group-hover/btn:scale-110 transition-transform" />
      </button>

      <div>
        {/* Image Box */}
        <div
          onClick={() => navigate(`/product/${item.id}`)}
          className="relative bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[170px] mb-3 overflow-hidden cursor-pointer"
        >
          {item.category && (
            <span className="absolute top-2 left-2 z-10 pointer-events-none">
              <Badge tone="sale">{item.category.toUpperCase()}</Badge>
            </span>
          )}

          {item.image ? (
            <img
              src={item.image}
              alt={item.title || item.name}
              className="max-h-[145px] object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="text-5xl text-slate-300 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-box" />
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-1.5">
          <RatingStars value={ratingValue} count={ratingCount} size="sm" />
        </div>

        {/* Title */}
        <h3
          onClick={() => navigate(`/product/${item.id}`)}
          className="min-h-[2.5rem] text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors cursor-pointer"
          title={item.title || item.name}
        >
          {item.title || item.name}
        </h3>
      </div>

      {/* Price & Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <PriceTag
            price={item.price}
            compareAtPrice={item.price ? item.price * 1.25 : null}
          />
          <StockStatus status={item.stockStatus || "in_stock"} />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 cursor-pointer"
            icon={isAdded ? "fa-solid fa-check" : "fa-solid fa-cart-shopping"}
            iconPosition="left"
            onClick={() => onAddToCart(item)}
          >
            {isAdded ? "Đã thêm!" : "Thêm giỏ hàng"}
          </Button>

          {/* <button
            type="button"
            onClick={() => navigate(`/product/${item.id}`)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors cursor-pointer"
            title="Xem chi tiết"
          >
            <i className="fa-regular fa-eye text-sm" />
          </button> */}
        </div>
      </div>
    </Card>
  );
}
