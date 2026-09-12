import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import Card from "../../Components/ui/Card";
import PriceTag from "../../Components/ui/PriceTag";
import RatingStars from "../../Components/ui/RatingStars";
import StockStatus from "../../Components/ui/StockStatus";
import Button from "../../Components/ui/Button";
import useCartStore from "../../Stores/cartStore";
import { getProducts } from "../../Services/productService";

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
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [addprId, setAddprId] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  // Fetch products from server with pagination & filters
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

  // Add to cart handler
  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product, 1);
    setAddprId(product.id);

    setTimeout(() => {
      setAddprId((curr) => (curr === product.id ? null : curr));
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs text-slate-500 mt-0.5">
                Khám phá các thiết bị điện tử, máy tính, smartphone chính hãng
                giá ưu đãi nhất
              </h2>
            </div>

            {/* Sort & Display options */}
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
        </div>

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
          <div className="py-16 text-center bg-white rounded-2xl border border-red-200 p-6">
            <i className="fa-solid fa-circle-exclamation text-3xl text-red-500 mb-2 block" />
            <p className="text-sm font-bold text-red-700">
              {error.response?.data?.message ||
                "Không thể tải sản phẩm lúc này. Vui lòng thử lại!"}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && products.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <i className="fa-solid fa-box-open text-5xl text-slate-300 mb-3 block" />
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy sản phẩm nào
            </h3>

            <button
              type="button"
              onClick={() => setSearchParams({ page: "1" })}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <Card
                key={product.id}
                hoverable
                className="flex flex-col justify-between h-full group"
              >
                <div>
                  <Link
                    to={`/product/${product.id}`}
                    className="block relative overflow-hidden rounded-xl"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-52 object-contain p-2 rounded-xl bg-slate-50 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      CHÍNH HÃNG
                    </span>
                  </Link>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-600 uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <StockStatus status="in_stock" />
                    </div>

                    <h2 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                      <Link
                        to={`/product/${product.id}`}
                        className="hover:text-emerald-600 transition-colors"
                      >
                        {product.title}
                      </Link>
                    </h2>

                    <div className="pt-0.5">
                      <RatingStars
                        value={Math.round(product.rating?.rate ?? 5)}
                        count={product.rating?.count ?? 20}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  <PriceTag price={product.price} />

                  <Button
                    className="w-full cursor-pointer"
                    icon="fa-solid fa-cart-shopping"
                    onClick={(event) => handleAddToCart(event, product)}
                  >
                    Thêm vào giỏ
                  </Button>

                  {addprId === product.id && (
                    <p className="text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg animate-fade-in">
                      ✓ Đã thêm vào giỏ hàng thành công!
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
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
              {/* Previous Page Button */}
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left text-[10px]" />
                <span>Trước</span>
              </button>

              {/* Numbered Page Buttons */}
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

              {/* Next Page Button */}
              <button
                type="button"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Sau</span>
                <i className="fa-solid fa-chevron-right text-[10px]" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
