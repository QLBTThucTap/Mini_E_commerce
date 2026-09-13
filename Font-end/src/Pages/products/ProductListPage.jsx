import { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import useCartStore from "../../Stores/cartStore";
import { getProducts } from "../../Services/productService";

import ProductCard from "../../Components/product/ProductCard";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";

const FOOTER_BRAND = {
  name: "LH - 1ST NYC TECH ONLINE MARKET",
  hotline: "0824781531",
  address: "273 phố Bạch Mai, quận Hai Bà Trưng, Hà Nội",
  email: "contact@swootechmart.com",
};

const FOOTER_COLUMNS = [
  {
    title: "Top Categories",
    links: [
      { label: "Laptops", href: "#laptops" },
      { label: "PC & Computers", href: "#pc" },
      { label: "Cell Phones", href: "#phones" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About me", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Help Center",
    links: [
      { label: "Customer Service", href: "#service" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    title: "Partner",
    links: [
      { label: "Become a Seller", href: "#become-seller" },
      { label: "Affiliate Program", href: "#affiliate" },
      { label: "Wholesale", href: "#wholesale" },
    ],
  },
];

const CATEGORIES = [
  { key: "all", label: "Tất cả sản phẩm" },
  { key: "laptop", label: "Laptops" },
  { key: "phone", label: "Điện thoại" },
  { key: "headphone", label: "Tai nghe & Âm thanh" },
  { key: "keyboard", label: "Bàn phím" },
  { key: "mouse", label: "Chuột & Phụ kiện" },
  { key: "watch", label: "Đồng hồ thông minh" },
  { key: "camera", label: "Máy ảnh & Quay phim" },
  { key: "monitor", label: "Màn hình máy tính" },
];

const PAGE_SIZE = 8;

export default function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [addprId, setAddprId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const addItem = useCartStore((state) => state.addItem);

  // Sửa lại hàm handleAddToCart nhận product trực tiếp từ ProductCard
  const handleAddToCart = (product) => {
    const itemData = product.original || product;

    // Thêm vào giỏ hàng theo đúng cấu trúc cartStore
    addItem(
      {
        id: itemData.id,
        title: itemData.title || itemData.name,
        price: itemData.price,
        image: itemData.image,
      },
      1,
    );

    // Lưu ID để hiển thị thông báo thành công dưới card vừa bấm
    setAddprId(itemData.id);

    setTimeout(() => {
      setAddprId((curr) => (curr === itemData.id ? null : curr));
    }, 2500);
  };

  // Fetch products từ API server
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "products-list",
      currentPage,
      currentCategory,
      currentSearch,
      currentSort,
    ],
    queryFn: () =>
      getProducts({
        page: currentPage,
        pageSize: PAGE_SIZE,
        category: currentCategory !== "all" ? currentCategory : undefined,
        q: currentSearch || undefined,
        sort: currentSort,
      }),
    placeholderData: keepPreviousData,
  });

  const products = useMemo(() => data?.items ?? [], [data]);
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  // Chuẩn hóa danh sách sản phẩm theo prop của ProductCard
  const mappedProducts = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      name: p.title,
      image: p.image,
      reviewCount: p.rating?.count ?? 20,
      price: p.price,
      compareAtPrice: p.price ? p.price * 1.25 : null,
      badge: {
        tone: "sale",
        label: (p.category || "CHÍNH HÃNG").toUpperCase(),
      },
      tags: ["FREESHIP"],
      stockStatus: "in_stock",
      isWishlisted: wishlist.includes(p.id),
      original: p,
    }));
  }, [products, wishlist]);

  // Pagination helper
  const setPage = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Category filter helper
  const handleCategoryChange = (catKey) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catKey === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", catKey);
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  // Sort helper
  const handleSortChange = (e) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sort", e.target.value);
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  // Handle Wishlist toggle
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      return exists
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id];
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#eff4ff] py-3 border-b border-slate-200/80">
        <div className="max-w-[1360px] mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hover:text-emerald-600 transition-colors flex items-center gap-1"
            >
              <i className="fa-solid fa-house text-xs" />
              <span>Trang chủ</span>
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
            <span className="text-slate-900 font-bold">Danh sách sản phẩm</span>
            {currentCategory !== "all" && (
              <>
                <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
                <span className="text-emerald-700 font-extrabold capitalize">
                  {CATEGORIES.find((c) => c.key === currentCategory)?.label ||
                    currentCategory}
                </span>
              </>
            )}
          </div>
          <span className="text-slate-500 hidden sm:inline">
            Tổng: <strong className="text-slate-800">{total}</strong> sản phẩm
          </span>
        </div>
      </div>

      <main className="max-w-[1360px] mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Category Pills Bar */}
        <Card className="shadow-xs">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs text-slate-500 mt-0.5">
                Khám phá các thiết bị điện tử, máy tính, smartphone chính hãng
                giá ưu đãi nhất
              </h2>
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-600">
                Sắp xếp:
              </label>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 pt-3 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Search query notice if filtered */}
        {currentSearch && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
            <span>
              Kết quả tìm kiếm cho: <strong>"{currentSearch}"</strong> ({total}{" "}
              sản phẩm)
            </span>
            <button
              type="button"
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.delete("q");
                nextParams.set("page", "1");
                setSearchParams(nextParams);
              }}
              className="font-bold underline text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              Xóa tìm kiếm
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="py-24 text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-emerald-600 mb-3 block" />
            <p className="text-sm font-semibold text-slate-500">
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <Card className="py-16 text-center border-red-200 p-6">
            <i className="fa-solid fa-circle-exclamation text-3xl text-red-500 mb-2 block" />
            <p className="text-sm font-bold text-red-700">
              {error.response?.data?.message ||
                "Không thể tải sản phẩm lúc này. Vui lòng thử lại!"}
            </p>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !error && products.length === 0 && (
          <Card className="py-20 text-center p-8">
            <i className="fa-solid fa-box-open text-5xl text-slate-300 mb-3 block" />
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy sản phẩm nào
            </h3>

            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => setSearchParams({ page: "1" })}
            >
              Xem tất cả sản phẩm
            </Button>
          </Card>
        )}

        {/* Danh sách sản phẩm và thông báo thành công */}
        {!isLoading && !error && mappedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {mappedProducts.map((prod) => (
              <div key={prod.id} className="flex flex-col gap-2">
                <ProductCard
                  product={prod}
                  onAddToWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onClick={() => navigate(`/product/${prod.id}`)}
                />

                {/* Đã sửa lỗi: kiểm tra chính xác ID của sản phẩm trong vòng lặp */}
                {addprId === prod.id && (
                  <p className="text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1.5 px-2 rounded-lg border border-emerald-200 animate-in fade-in duration-200">
                    ✓ Đã thêm vào giỏ hàng thành công!
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {!isLoading && !error && totalPages > 1 && (
          <Card
            padding="p-4 sm:p-5"
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 shadow-xs"
          >
            <p className="text-xs font-medium text-slate-500">
              Hiển thị{" "}
              <strong className="text-slate-800 font-bold">
                {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(currentPage * PAGE_SIZE, total)}
              </strong>{" "}
              trong tổng số{" "}
              <strong className="text-slate-800 font-bold">{total}</strong> sản
              phẩm
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                icon="fa-solid fa-chevron-left"
                iconPosition="left"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Trước
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      pageNumber === currentPage
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ),
              )}

              <Button
                variant="outline"
                size="sm"
                icon="fa-solid fa-chevron-right"
                iconPosition="right"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Sau
              </Button>
            </div>
          </Card>
        )}
      </main>

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
