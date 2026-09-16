import { useState, useMemo } from "react";
import PriceTag from "../../../Components/ui/PriceTag";
import Button from "../../../Components/ui/Button";
import useCartStore from "../../../Stores/cartStore";

export default function FrequentlyBoughtTogether({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [addedMessage, setAddedMessage] = useState("");

  // Tạo 2 phụ kiện đi kèm theo sản phẩm chính
  const bundleItems = useMemo(() => {
    if (!product) return [];

    return [
      {
        id: `acc-1-${product.id}`,
        title: "Ốp lưng Silicon chống sốc thế hệ mới",
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: `acc-2-${product.id}`,
        title: "Củ sạc nhanh GaN 35W Type-C chính hãng",
        price: 34.99,
        image:
          "https://cdn.hoanghamobile.vn/i/previewV2/Uploads/2026/02/24/cu-sac-60w-khong-kem-cap-1.png",
      },
    ];
  }, [product]);

  // State các sản phẩm đang được chọn trong combo (mặc định chọn cả 3)
  const [selectedIds, setSelectedIds] = useState({
    main: true,
    acc1: true,
    acc2: true,
  });

  const toggleSelect = (key) => {
    setSelectedIds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Tính tổng tiền combo
  const allItems = useMemo(() => {
    if (!product || bundleItems.length < 2) return [];
    return [
      { key: "main", data: product, isMain: true },
      { key: "acc1", data: bundleItems[0], isMain: false },
      { key: "acc2", data: bundleItems[1], isMain: false },
    ];
  }, [product, bundleItems]);

  const selectedItems = allItems.filter((it) => selectedIds[it.key]);
  const totalPrice = selectedItems.reduce(
    (sum, it) => sum + (it.data.price || 0),
    0,
  );
  const originalPrice = totalPrice * 1.15; // Giả định mua lẻ đắt hơn 15%
  const savings = originalPrice - totalPrice;

  const handleAddBundleToCart = () => {
    selectedItems.forEach((it) => {
      addItem(
        {
          id: it.data.id,
          title: it.data.title || it.data.name,
          price: it.data.price,
          image: it.data.image,
        },
        1,
      );
    });

    setAddedMessage(
      `✓ Đã thêm ${selectedItems.length} sản phẩm combo vào giỏ!`,
    );
    setTimeout(() => setAddedMessage(""), 2500);
  };

  if (!product) return null;

  return (
    <section className="my-10 bg-white rounded-2xl border border-slate-200/90 p-6 lg:p-8 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
            <i className="fa-solid fa-layer-group" />
          </span>
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-slate-900">
              Frequently Bought Together (Thường mua cùng nhau)
            </h3>
            <p className="text-xs text-slate-500">
              Tiết kiệm hơn khi mua combo phụ kiện bảo vệ và sạc nhanh đi kèm
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        {/* Danh sách thẻ sản phẩm dạng chuỗi + */}
        <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-start gap-4">
          {/* 1. Sản phẩm chính */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 max-w-[240px] w-full">
            <input
              type="checkbox"
              id="bundle-main"
              checked={selectedIds.main}
              onChange={() => toggleSelect("main")}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <img
              src={product.image}
              alt={product.title}
              className="w-16 h-16 object-contain bg-white rounded-lg p-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <label
                htmlFor="bundle-main"
                className="block text-xs font-bold text-slate-800 line-clamp-1 cursor-pointer"
              >
                {product.title}
              </label>
              <PriceTag price={product.price} size="sm" tone="sale" />
              <span className="text-[10px] font-bold text-emerald-600">
                Sản phẩm chính
              </span>
            </div>
          </div>

          <span className="text-slate-400 font-extrabold text-lg">+</span>

          {/* 2. Phụ kiện 1 */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 max-w-[240px] w-full">
            <input
              type="checkbox"
              id="bundle-acc1"
              checked={selectedIds.acc1}
              onChange={() => toggleSelect("acc1")}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <img
              src={bundleItems[0].image}
              alt={bundleItems[0].title}
              className="w-16 h-16 object-contain bg-white rounded-lg p-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <label
                htmlFor="bundle-acc1"
                className="block text-xs font-bold text-slate-800 line-clamp-1 cursor-pointer"
              >
                {bundleItems[0].title}
              </label>
              <PriceTag price={bundleItems[0].price} size="sm" />
              <span className="text-[10px] text-slate-500">
                Ốp lưng chính hãng
              </span>
            </div>
          </div>

          <span className="text-slate-400 font-extrabold text-lg">+</span>

          {/* 3. Phụ kiện 2 */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 max-w-[240px] w-full">
            <input
              type="checkbox"
              id="bundle-acc2"
              checked={selectedIds.acc2}
              onChange={() => toggleSelect("acc2")}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <img
              src={bundleItems[1].image}
              alt={bundleItems[1].title}
              className="w-16 h-16 object-contain bg-white rounded-lg p-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <label
                htmlFor="bundle-acc2"
                className="block text-xs font-bold text-slate-800 line-clamp-1 cursor-pointer"
              >
                {bundleItems[1].title}
              </label>
              <PriceTag price={bundleItems[1].price} size="sm" />
              <span className="text-[10px] text-slate-500">Củ sạc GaN 35W</span>
            </div>
          </div>
        </div>

        {/* Khối Tổng kết Combo bên phải */}
        <div className="w-full lg:w-72 p-5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col justify-between shrink-0">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              Giá trọn bộ ({selectedItems.length} sản phẩm):
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-700">
                ${totalPrice.toFixed(2)}
              </span>
              {savings > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-[11px] text-emerald-700 font-bold mt-1">
                Tiết kiệm: ${savings.toFixed(2)} khi mua cùng
              </p>
            )}
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="w-full justify-center shadow-xs"
              icon="fa-solid fa-cart-plus"
              iconPosition="left"
              disabled={selectedItems.length === 0}
              onClick={handleAddBundleToCart}
            >
              Thêm combo vào giỏ
            </Button>
            {addedMessage && (
              <p className="text-[11px] font-bold text-emerald-700 text-center mt-2 animate-in fade-in">
                {addedMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
