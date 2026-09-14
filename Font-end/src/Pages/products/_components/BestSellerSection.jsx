import { Link } from "react-router-dom";
import Card from "../../../Components/ui/Card";
import Badge from "../../../Components/ui/Badge";
import PriceTag from "../../../Components/ui/PriceTag";

export default function BestSellerSection({
  products = [],
  onAddToCart,
  onAddToWishlist,
}) {
  if (!products || products.length === 0) return null;

  // Lấy 3 sản phẩm có rating cao nhất làm best seller
  const topProducts = products.slice(0, 3);

  return (
    <Card padding="p-4 sm:p-5" className="shadow-xs mb-6 bg-gradient-to-r from-emerald-50/40 via-white to-white">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm shadow-xs">
            <i className="fa-solid fa-crown" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Sản phẩm bán chạy & Nổi bật
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Top sản phẩm được khách hàng đánh giá cao nhất
            </p>
          </div>
        </div>
        <Badge tone="warning">HOT DEAL</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topProducts.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            {/* Ảnh sản phẩm */}
            <Link
              to={`/product/${p.id}`}
              className="w-16 h-16 shrink-0 bg-slate-50 rounded-lg p-1.5 flex items-center justify-center overflow-hidden"
            >
              <img
                src={p.image}
                alt={p.title || p.name}
                className="max-h-full object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Thông tin */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-0.5">
                <i className="fa-solid fa-star text-[10px]" />
                <span>{p.rating?.rate || 4.8}</span>
                <span className="text-slate-400 font-normal">
                  ({p.rating?.count || 120})
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                <Link to={`/product/${p.id}`}>{p.title || p.name}</Link>
              </h4>
              <div className="flex items-center justify-between gap-1 mt-1">
                <PriceTag price={p.price} size="sm" />
                <div className="flex items-center gap-1">
                  {onAddToWishlist && (
                    <button
                      type="button"
                      onClick={() => onAddToWishlist(p)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                      title="Yêu thích"
                    >
                      <i className="fa-regular fa-heart text-xs" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onAddToCart && onAddToCart(p)}
                    className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Thêm vào giỏ"
                  >
                    <i className="fa-solid fa-cart-plus text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
