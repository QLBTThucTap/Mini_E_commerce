import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCartStore from "../../Stores/cartStore";
import useWishlistStore from "../../Stores/wishlistStore";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import Button from "../../Components/ui/Button";

import { getProductById } from "../../Services/productService";
import { FOOTER_BRAND, FOOTER_COLUMNS } from "../home/_constants/footer";

import ProductBreadcrumb from "./_detail_components/ProductBreadcrumb";
import ProductGallery from "./_detail_components/ProductGallery";
import ProductInfo from "./_detail_components/ProductInfo";
import FrequentlyBoughtTogether from "./_detail_components/FrequentlyBoughtTogether";
import ProductDetailTabs from "./_detail_components/ProductDetailTabs";
import RelatedProducts from "./_detail_components/RelatedProducts";
import RecentlyViewedProducts from "./_detail_components/RecentlyViewedProducts";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) =>
    product ? state.items.some((item) => item.id === product.id) : false,
  );

  // Cuộn mượt lên đầu trang khi đổi productId
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  // Tải chi tiết sản phẩm từ API
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Không thể hiển thị thông tin sản phẩm lúc này!",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const decreaseQuantity = () => {
    setQuantity((curr) => Math.max(1, curr - 1));
  };

  const increaseQuantity = () => {
    setQuantity((curr) => curr + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng thành công!`);
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const added = toggleWishlist(product);
    setMessage(
      added
        ? "Đã thêm sản phẩm vào danh sách yêu thích!"
        : "Đã xóa sản phẩm khỏi danh sách yêu thích!",
    );
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. HEADER */}
      <Header />

      {/* Loading state */}
      {loading && (
        <main className="flex-1 max-w-[1360px] mx-auto px-4 py-24 text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-emerald-600 mb-3 block" />
          <p className="text-sm font-semibold text-slate-500">
            Đang tải thông tin sản phẩm...
          </p>
        </main>
      )}

      {/* Error state */}
      {error && !loading && (
        <main className="flex-1 max-w-[1360px] mx-auto px-4 py-24 text-center">
          <div className="bg-white p-8 rounded-2xl border border-red-200 max-w-md mx-auto shadow-xs">
            <i className="fa-solid fa-circle-exclamation text-4xl text-red-500 mb-3 block" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-xs text-red-600 mb-4">{error}</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/products")}
            >
              Quay lại danh sách sản phẩm
            </Button>
          </div>
        </main>
      )}

      {/* Content khi đã có dữ liệu sản phẩm */}
      {!loading && !error && product && (
        <>
          {/* 2. BREADCRUMB */}
          <ProductBreadcrumb product={product} />

          <main className="max-w-[1360px] mx-auto px-4 flex-1 w-full pb-12">
            {/* 3. KHU VỰC THÔNG TIN CHÍNH (Ảnh trái + Thông tin phải) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Bên trái: Gallery ảnh */}
              <div className="lg:col-span-5">
                <ProductGallery product={product} />
              </div>

              {/* Bên phải: Thông tin sản phẩm, options, giá & nút mua */}
              <div className="lg:col-span-7">
                <ProductInfo
                  product={product}
                  quantity={quantity}
                  onDecreaseQuantity={decreaseQuantity}
                  onIncreaseQuantity={increaseQuantity}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  message={message}
                />
              </div>
            </section>

            {/* 4. FREQUENTLY BOUGHT TOGETHER */}
            <FrequentlyBoughtTogether product={product} />

            {/* 5. THÔNG TIN CHI TIẾT SẢN PHẨM (Tabs Description / Specs / Reviews / Shipping) */}
            <ProductDetailTabs product={product} />

            {/* 6. RELATED PRODUCTS (Sản phẩm liên quan) */}
            <RelatedProducts currentProduct={product} />

            {/* 7. RECENTLY VIEWED (Sản phẩm vừa xem) */}
            <RecentlyViewedProducts currentProduct={product} />
          </main>
        </>
      )}

      {/* 8. FOOTER */}
      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
