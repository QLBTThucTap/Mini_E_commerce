import { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import useCartStore from "../../Stores/cartStore";
import useWishlistStore from "../../Stores/wishlistStore";
import { getProducts, getCategories } from "../../Services/productService";

import ProductCard from "../../Components/product/ProductCard";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import PriceTag from "../../Components/ui/PriceTag";

import ProductFilterSidebar from "./_components/ProductFilterSidebar";
import ProductToolbar from "./_components/ProductToolbar";
import ActiveFilterChips from "./_components/ActiveFilterChips";
import BestSellerSection from "./_components/BestSellerSection";
import MobileFilterDrawer from "./_components/MobileFilterDrawer";

import { FOOTER_BRAND, FOOTER_COLUMNS } from "../home/_constants/footer";

const PAGE_SIZE = 8;

const CATEGORY_LABELS = {
  laptop: "Laptops",
  phone: "Điện thoại",
  headphone: "Tai nghe & Âm thanh",
  keyboard: "Bàn phím",
  mouse: "Chuột & Phụ kiện",
};

export default function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentCategory = searchParams.get("category") || "all";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSearch = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "newest";

  // UI States
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addprId, setAddprId] = useState(null);

  // Global Stores
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const addItem = useCartStore((state) => state.addItem);

  // Fetch danh mục từ backend API
  const { data: categoriesData } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getCategories,
  });

  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);

  // Fetch products theo bộ lọc từ API server
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "products-list",
      currentPage,
      currentCategory,
      currentMinPrice,
      currentMaxPrice,
      currentSearch,
      currentSort,
    ],
    queryFn: () =>
      getProducts({
        page: currentPage,
        pageSize: PAGE_SIZE,
        category: currentCategory !== "all" ? currentCategory : undefined,
        minPrice:
          currentMinPrice !== "" && !isNaN(Number(currentMinPrice))
            ? Number(currentMinPrice)
            : undefined,
        maxPrice:
          currentMaxPrice !== "" && !isNaN(Number(currentMaxPrice))
            ? Number(currentMaxPrice)
            : undefined,
        q: currentSearch || undefined,
        sort: currentSort,
      }),
    placeholderData: keepPreviousData,
  });

  // Fetch top rated products cho Best Seller section
  const { data: bestSellerData } = useQuery({
    queryKey: ["best-seller-products"],
    queryFn: () => getProducts({ page: 1, pageSize: 6, sort: "newest" }),
  });

  const bestSellerProducts = useMemo(
    () => bestSellerData?.items ?? [],
    [bestSellerData],
  );

  const products = useMemo(() => data?.items ?? [], [data]);
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  // Add to cart handler
  const handleAddToCart = (product) => {
    const itemData = product.original || product;
    addItem(
      {
        id: itemData.id,
        title: itemData.title || itemData.name,
        price: itemData.price,
        image: itemData.image,
      },
      1,
    );

    setAddprId(itemData.id);
    setTimeout(() => {
      setAddprId((curr) => (curr === itemData.id ? null : curr));
    }, 2500);
  };

  // Toggle wishlist handler
  const handleToggleWishlist = (product) => {
    toggleWishlist(product.original || product);
  };

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
      isWishlisted: wishlistItems.some((item) => item.id === p.id),
      original: p,
    }));
  }, [products, wishlistItems]);

  // Phân trang helper
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

  // Price filter helper (Apply Min & Max)
  const handleApplyPriceFilter = (min, max) => {
    const nextParams = new URLSearchParams(searchParams);
    if (min !== "") {
      nextParams.set("minPrice", min);
    } else {
      nextParams.delete("minPrice");
    }

    if (max !== "") {
      nextParams.set("maxPrice", max);
    } else {
      nextParams.delete("maxPrice");
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  // Reset all filters
  const handleResetAll = () => {
    const nextParams = new URLSearchParams();
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  // Remove individual filters
  const handleRemoveCategory = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("category");
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleRemoveMinPrice = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("minPrice");
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleRemoveMaxPrice = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("maxPrice");
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleRemoveSearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("q");
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

  // Đếm số lượng bộ lọc đang active
  const activeFilterCount =
    (currentCategory !== "all" ? 1 : 0) +
    (currentMinPrice !== "" ? 1 : 0) +
    (currentMaxPrice !== "" ? 1 : 0) +
    (currentSearch ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#eff4ff] py-3 border-b border-slate-200/80">
        <div className="max-w-[1360px] mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
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
                  {CATEGORY_LABELS[currentCategory] || currentCategory}
                </span>
              </>
            )}
            {(currentMinPrice !== "" || currentMaxPrice !== "") && (
              <>
                <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
                <span className="text-emerald-700 font-bold">
                  Khoảng giá:{" "}
                  {currentMinPrice !== "" ? `$${currentMinPrice}` : "$0"} -{" "}
                  {currentMaxPrice !== "" ? `$${currentMaxPrice}` : "∞"}
                </span>
              </>
            )}
          </div>
          <span className="text-slate-500 hidden sm:inline">
            Tổng: <strong className="text-slate-800">{total}</strong> sản phẩm
          </span>
        </div>
      </div>

      <main className="max-w-[1360px] mx-auto px-4 py-6 sm:py-8 flex-1 w-full">
        {/* Bố cục 2 cột: Sidebar bên trái & Product Listing bên phải */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* CỘT TRÁI: Filter Sidebar Desktop */}
          <aside className="w-full lg:w-72 shrink-0 hidden lg:block sticky top-[60px] self-start max-h-[calc(100vh-75px)] overflow-y-auto pr-1">
            <ProductFilterSidebar
              key={`desktop-${currentMinPrice}-${currentMaxPrice}-${currentCategory}`}
              categories={categories}
              selectedCategory={currentCategory}
              onSelectCategory={handleCategoryChange}
              minPrice={currentMinPrice}
              maxPrice={currentMaxPrice}
              onApplyPriceFilter={handleApplyPriceFilter}
              onResetAll={handleResetAll}
            />
          </aside>

          {/* CỘT PHẢI: Product Listing Area */}
          <div className="flex-1 w-full min-w-0 space-y-5">
            {/* 1. Best Seller Section (chỉ hiển thị khi không có search) */}
            {!currentSearch && (
              <BestSellerSection
                products={bestSellerProducts}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleToggleWishlist}
              />
            )}

            {/* 2. Product Toolbar (Result count, Sort, View mode, Mobile filter button) */}
            <ProductToolbar
              total={total}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              sort={currentSort}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {/* 3. Active Filter Chips */}
            <ActiveFilterChips
              selectedCategory={currentCategory}
              onRemoveCategory={handleRemoveCategory}
              minPrice={currentMinPrice}
              onRemoveMinPrice={handleRemoveMinPrice}
              maxPrice={currentMaxPrice}
              onRemoveMaxPrice={handleRemoveMaxPrice}
              searchQuery={currentSearch}
              onRemoveSearch={handleRemoveSearch}
              onResetAll={handleResetAll}
            />

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
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.location.reload()}
                >
                  Tải lại trang
                </Button>
              </Card>
            )}

            {/* Empty state */}
            {!isLoading && !error && products.length === 0 && (
              <Card className="py-20 text-center p-8">
                <i className="fa-solid fa-box-open text-5xl text-slate-300 mb-3 block" />
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Không có sản phẩm nào phù hợp với bộ lọc bạn đã chọn. Hãy thử
                  điều chỉnh khoảng giá hoặc danh mục khác.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleResetAll}
                  icon="fa-solid fa-rotate-left"
                  iconPosition="left"
                >
                  Đặt lại tất cả bộ lọc
                </Button>
              </Card>
            )}

            {/* Product Grid / List view */}
            {!isLoading && !error && mappedProducts.length > 0 && (
              <>
                {viewMode === "grid" ? (
                  /* Dạng lưới 2 - 3 - 4 cột */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {mappedProducts.map((prod) => (
                      <div key={prod.id} className="flex flex-col gap-2">
                        <ProductCard
                          product={prod}
                          onAddToWishlist={handleToggleWishlist}
                          onAddToCart={handleAddToCart}
                          onClick={() => navigate(`/product/${prod.id}`)}
                        />

                        {addprId === prod.id && (
                          <p className="text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1.5 px-2 rounded-lg border border-emerald-200 animate-in fade-in duration-200">
                            ✓ Đã thêm vào giỏ hàng thành công!
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Dạng danh sách hàng ngang (List view) */
                  <div className="space-y-4">
                    {mappedProducts.map((prod) => (
                      <Card
                        key={prod.id}
                        hoverable
                        className="flex flex-col sm:flex-row items-center justify-between gap-5 p-4 group cursor-pointer"
                        onClick={() => navigate(`/product/${prod.id}`)}
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto flex-1">
                          {/* Image */}
                          <div className="w-full sm:w-36 h-36 shrink-0 bg-slate-50 rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
                            {prod.badge && (
                              <span className="absolute top-2 left-2 z-10">
                                <Badge tone={prod.badge.tone}>
                                  {prod.badge.label}
                                </Badge>
                              </span>
                            )}
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="max-h-28 object-contain group-hover:scale-105 transition-transform"
                            />
                          </div>

                          {/* Info */}
                          <div className="space-y-1.5 text-center sm:text-left flex-1">
                            <div className="text-[11px] text-slate-400 font-medium">
                              ({prod.reviewCount} đánh giá)
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {prod.original?.description}
                            </p>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              FREESHIP
                            </span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-44 shrink-0 gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <PriceTag
                            price={prod.price}
                            compareAtPrice={prod.compareAtPrice}
                            size="lg"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleWishlist(prod);
                              }}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                prod.isWishlisted
                                  ? "bg-red-50 border-red-200 text-red-500"
                                  : "bg-slate-50 border-slate-200 text-slate-500 hover:text-red-500"
                              }`}
                              title="Yêu thích"
                            >
                              <i
                                className={`fa-${
                                  prod.isWishlisted ? "solid" : "regular"
                                } fa-heart text-sm`}
                              />
                            </button>
                            <Button
                              variant="primary"
                              size="sm"
                              icon="fa-solid fa-cart-plus"
                              iconPosition="left"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(prod);
                              }}
                            >
                              Thêm giỏ
                            </Button>
                          </div>
                          {addprId === prod.id && (
                            <p className="text-right text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded border border-emerald-200 animate-in fade-in">
                              ✓ Đã thêm!
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
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
                  <strong className="text-slate-800 font-bold">{total}</strong>{" "}
                  sản phẩm
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
          </div>
        </div>
      </main>

      {/* Drawer bộ lọc trên Mobile/Tablet */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        selectedCategory={currentCategory}
        onSelectCategory={handleCategoryChange}
        minPrice={currentMinPrice}
        maxPrice={currentMaxPrice}
        onApplyPriceFilter={handleApplyPriceFilter}
        onResetAll={handleResetAll}
      />

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
