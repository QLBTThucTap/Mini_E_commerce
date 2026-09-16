import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../Components/product/ProductCard";
import { getProducts } from "../../../Services/productService";
import useCartStore from "../../../Stores/cartStore";
import useWishlistStore from "../../../Stores/wishlistStore";

export default function RelatedProducts({ currentProduct }) {
  const navigate = useNavigate();
  const [relatedList, setRelatedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    if (!currentProduct?.category) return;

    let isMounted = true;
    async function fetchRelated() {
      try {
        setLoading(true);
        const res = await getProducts({
          category: currentProduct.category,
          pageSize: 5,
        });

        const items = res?.items || (Array.isArray(res) ? res : []);
        // Loại bỏ sản phẩm đang xem
        const filtered = items
          .filter((p) => String(p.id) !== String(currentProduct.id))
          .slice(0, 4);

        if (isMounted) setRelatedList(filtered);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm liên quan:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRelated();
    return () => {
      isMounted = false;
    };
  }, [currentProduct?.id, currentProduct?.category]);

  if (!loading && relatedList.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Related Products (Sản phẩm liên quan)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Các sản phẩm tương tự cùng danh mục bạn có thể quan tâm
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          <i className="fa-solid fa-spinner fa-spin text-emerald-600 text-lg mb-2 block" />
          Đang tải sản phẩm liên quan...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {relatedList.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.title || p.name,
                image: p.image,
                reviewCount: p.rating?.count ?? 25,
                price: p.price,
                compareAtPrice: p.price ? p.price * 1.25 : null,
                badge: { tone: "sale", label: (p.category || "CHÍNH HÃNG").toUpperCase() },
                tags: ["FREESHIP"],
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
      )}
    </section>
  );
}
