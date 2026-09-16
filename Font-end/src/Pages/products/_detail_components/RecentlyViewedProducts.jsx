import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../Components/product/ProductCard";
import useCartStore from "../../../Stores/cartStore";
import useWishlistStore from "../../../Stores/wishlistStore";

const STORAGE_KEY = "recently_viewed_products";

function readStoredList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default function RecentlyViewedProducts({ currentProduct }) {
  const navigate = useNavigate();
  const [clearedAt, setClearedAt] = useState(0); // dùng để ép tính lại sau khi "Xóa lịch sử"

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const wishlistItems = useWishlistStore((state) => state.items);

  // 1. Chỉ dùng effect để ĐỒNG BỘ với localStorage (hệ thống ngoài) — không setState ở đây
  useEffect(() => {
    if (!currentProduct?.id) return;

    try {
      let list = readStoredList().filter(
        (item) => String(item.id) !== String(currentProduct.id),
      );

      const newItem = {
        id: currentProduct.id,
        title: currentProduct.title || currentProduct.name,
        name: currentProduct.title || currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.image,
        category: currentProduct.category,
        rating: currentProduct.rating,
      };

      list.unshift(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 8)));
    } catch (e) {
      console.error("Lỗi lưu recently viewed:", e);
    }
  }, [
    currentProduct?.id,
    currentProduct?.title,
    currentProduct?.name,
    currentProduct?.price,
    currentProduct?.image,
    currentProduct?.category,
    currentProduct?.rating,
  ]);

  // 2. Danh sách hiển thị được TÍNH TOÁN (derived), không lưu state riêng
  const recentList = useMemo(() => {
    return readStoredList().filter(
      (it) => String(it.id) !== String(currentProduct?.id),
    );
  }, [currentProduct?.id, clearedAt]);

  const handleClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setClearedAt(Date.now()); // set trong event handler, không phải trong effect → không bị lint cảnh báo
    } catch (e) {
      console.error(e);
    }
  };

  if (recentList.length === 0) return null;

  return (
    <section className="my-10 pt-6 border-t border-slate-200">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80">
        <div>
          <h3 className="text-lg font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Recently Viewed (Sản phẩm vừa xem)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Lịch sử các sản phẩm bạn đã xem gần đây
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1"
        >
          <i className="fa-regular fa-trash-can" />
          <span>Xóa lịch sử</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {recentList.slice(0, 4).map((p) => (
          <ProductCard
            key={p.id}
            product={{
              id: p.id,
              name: p.title || p.name,
              image: p.image,
              reviewCount: p.rating?.count ?? 15,
              price: p.price,
              compareAtPrice: p.price ? p.price * 1.25 : null,
              badge: {
                tone: "sale",
                label: (p.category || "CHÍNH HÃNG").toUpperCase(),
              },
              tags: ["GẦN ĐÂY"],
              stockStatus: "in_stock",
              isWishlisted: wishlistItems.some((it) => it.id === p.id),
              original: p,
            }}
            onAddToCart={() => addItem(p, 1)}
            onAddToWishlist={() => toggleWishlist(p)}
            onClick={() => {
              navigate(`/product/${p.id}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ))}
      </div>
    </section>
  );
}