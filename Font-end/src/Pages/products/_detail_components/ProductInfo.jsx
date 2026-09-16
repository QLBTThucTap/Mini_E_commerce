import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "../../../Components/ui/RatingStars";
import PriceTag from "../../../Components/ui/PriceTag";
import StockStatus from "../../../Components/ui/StockStatus";
import Button from "../../../Components/ui/Button";

const COLOR_OPTIONS = [
  { id: "titan-natural", name: "Titan Tự Nhiên", hex: "#b8afa3" },
  { id: "titan-black", name: "Titan Đen", hex: "#2b2b2e" },
  { id: "titan-white", name: "Titan Trắng", hex: "#e8e8ea" },
  { id: "titan-blue", name: "Titan Xanh", hex: "#2c3647" },
];

const STORAGE_OPTIONS = ["128GB", "256GB", "512GB", "1TB"];

export default function ProductInfo({
  product,
  quantity,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  message,
}) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedStorage, setSelectedStorage] = useState(STORAGE_OPTIONS[1]); // 256GB default

  if (!product) return null;

  const compareAtPrice = product.price ? product.price * 1.25 : null;
  const ratingRate = product.rating?.rate || 4.9;
  const reviewCount = product.rating?.count || 128;

  const handleBuyNow = () => {
    onAddToCart();
    navigate("/checkout");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
      <div>
        {/* Brand & Stock status row */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            {product.category || "CÔNG NGHỆ"}
          </span>
          <StockStatus status="in_stock" />
        </div>

        {/* Tên sản phẩm */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
          {product.title || product.name}
        </h1>

        {/* Đánh giá & Lượt mua */}
        <div className="flex items-center gap-3 mt-3 pb-4 border-b border-slate-100 flex-wrap text-xs">
          <RatingStars value={Math.round(ratingRate)} count={reviewCount} size="sm" />
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-semibold">
            Đã bán: <strong className="text-slate-900 font-bold">1,480+</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <i className="fa-solid fa-circle-check text-emerald-600" />
            Có sẵn hàng tại Showroom
          </span>
        </div>

        {/* Giá & Tiết kiệm */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase text-slate-400">
              Giá ưu đãi đặc quyền:
            </div>
            <PriceTag
              price={product.price}
              compareAtPrice={compareAtPrice}
              size="xl"
              tone="sale"
            />
          </div>

          {compareAtPrice && (
            <div className="bg-rose-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-xs">
              Tiết kiệm ${(compareAtPrice - product.price).toFixed(2)} (-25%)
            </div>
          )}
        </div>

        {/* Thông số nổi bật (Highlights) */}
        <div className="mt-5">
          <div className="text-xs font-bold text-slate-700 mb-2">
            Đặc điểm nổi bật:
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5">
              <i className="fa-solid fa-microchip text-emerald-600" /> Chip xử lý cao cấp
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5">
              <i className="fa-solid fa-mobile-screen text-emerald-600" /> Màn hình 120Hz mượt mà
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5">
              <i className="fa-solid fa-bolt text-emerald-600" /> Sạc siêu nhanh 45W
            </span>
          </div>
        </div>

        {/* Lựa chọn Màu sắc (Color Swatches) */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-800">
              Màu sắc:{" "}
              <strong className="text-emerald-700">{selectedColor.name}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {COLOR_OPTIONS.map((c) => {
              const isSelected = selectedColor.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-600"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lựa chọn Dung lượng / Phiên bản */}
        <div className="mt-5">
          <div className="text-xs font-bold text-slate-800 mb-2">
            Phiên bản dung lượng:
          </div>
          <div className="grid grid-cols-4 gap-2">
            {STORAGE_OPTIONS.map((opt) => {
              const isSelected = selectedStorage === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedStorage(opt)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hộp Khuyến Mãi / Ưu Đãi độc quyền */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 uppercase mb-2">
            <i className="fa-solid fa-gift text-amber-600 text-sm" />
            <span>Ưu đãi & Quà tặng kèm theo</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-emerald-600 mt-0.5 text-[11px] shrink-0" />
              <span>Tặng củ sạc nhanh chính hãng 30W trị giá <strong>$45.00</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-emerald-600 mt-0.5 text-[11px] shrink-0" />
              <span>Tặng gói dán cường lực cao cấp & ốp lưng bảo vệ máy</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-emerald-600 mt-0.5 text-[11px] shrink-0" />
              <span>Giảm thêm 5% khi thanh toán qua chuyển khoản ngân hàng</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Cụm Thao Tác Mua Hàng */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Bộ chọn số lượng */}
          <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-slate-50 p-1 shrink-0">
            <button
              type="button"
              onClick={onDecreaseQuantity}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
            >
              −
            </button>
            <span className="w-12 text-center font-extrabold text-slate-900 text-sm">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncreaseQuantity}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Nút Thêm vào giỏ */}
          <Button
            type="button"
            variant="outline"
            className="flex-1 justify-center py-3 text-emerald-700 border-emerald-600 hover:bg-emerald-50 cursor-pointer font-bold"
            icon="fa-solid fa-cart-plus"
            iconPosition="left"
            onClick={onAddToCart}
          >
            Thêm vào giỏ
          </Button>

          {/* Nút Mua ngay */}
          <Button
            type="button"
            variant="primary"
            className="flex-1 justify-center py-3 shadow-md shadow-emerald-600/20 cursor-pointer font-bold"
            icon="fa-solid fa-bolt"
            iconPosition="left"
            onClick={handleBuyNow}
          >
            Mua ngay
          </Button>

          {/* Nút Yêu thích */}
          <button
            type="button"
            onClick={onToggleWishlist}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              isWishlisted
                ? "bg-rose-50 border-rose-200 text-rose-500 shadow-xs"
                : "bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200"
            }`}
            title={isWishlisted ? "Gỡ khỏi danh sách yêu thích" : "Lưu vào yêu thích"}
          >
            <i className={`text-lg ${isWishlisted ? "fa-solid" : "fa-regular"} fa-heart`} />
          </button>
        </div>

        {/* Thông báo thao tác */}
        {message && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-in fade-in">
            ✓ {message}
          </div>
        )}
      </div>
    </div>
  );
}
