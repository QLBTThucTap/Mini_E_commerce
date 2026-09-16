import { useState } from "react";
export default function ProductGallery({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!product) return null;

  // Chuẩn bị danh sách ảnh gallery (nếu có mảng images thì dùng, nếu không tạo các view thumbnail)
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image, product.image, product.image, product.image];

  const activeImage = images[activeIndex] || product.image;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Ảnh chính lớn */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex items-center justify-center min-h-[380px] sm:min-h-[440px] overflow-hidden group shadow-xs">
        {/* Nút phóng to / xem ảnh */}
        <button
          type="button"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
          title="Phóng to ảnh"
          onClick={() => window.open(activeImage, "_blank")}
        >
          <i className="fa-solid fa-expand" />
        </button>

        {/* Ảnh hiển thị */}
        <img
          src={activeImage}
          alt={product.title || product.name}
          className="max-h-[340px] sm:max-h-[380px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
        />
      </div>

      {/* 2. Danh sách Thumbnail bên dưới */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {images.map((imgUrl, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={`thumb-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 shrink-0 rounded-xl bg-white border-2 p-2 flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
                isActive
                  ? "border-emerald-600 shadow-sm ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={imgUrl}
                alt={`Thumbnail ${idx + 1}`}
                className="max-h-full max-w-full object-contain"
              />
              {isActive && (
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Cam kết dịch vụ & Niềm tin khách hàng */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700">
          <i className="fa-solid fa-shield-halved text-emerald-600 text-sm shrink-0" />
          <div className="leading-tight text-[11px]">
            <strong className="block font-bold">Bảo hành</strong>
            <span className="text-slate-500">12 tháng chính hãng</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700">
          <i className="fa-solid fa-rotate-left text-emerald-600 text-sm shrink-0" />
          <div className="leading-tight text-[11px]">
            <strong className="block font-bold">Đổi trả 30 ngày</strong>
            <span className="text-slate-500">Lỗi 1 đổi 1 ngay</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700">
          <i className="fa-solid fa-truck-fast text-emerald-600 text-sm shrink-0" />
          <div className="leading-tight text-[11px]">
            <strong className="block font-bold">Miễn phí ship</strong>
            <span className="text-slate-500">Đơn từ $199</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700">
          <i className="fa-solid fa-credit-card text-emerald-600 text-sm shrink-0" />
          <div className="leading-tight text-[11px]">
            <strong className="block font-bold">Thanh toán</strong>
            <span className="text-slate-500">Bảo mật 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
