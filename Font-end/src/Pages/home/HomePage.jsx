import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import useCartStore from "../../Stores/cartStore";
import { getProducts } from "../../Services/productService";

import HeroShowcase from "./_components/HeroShowcase";
import DealsOfDaySection from "./_components/DealsOfDaySection";

import ProductCard from "../../Components/product/ProductCard";
import SectionHeader from "../../Components/common/SectionHeader";

import { HERO_SLIDES } from "./_constants/hero";
import { FOOTER_BRAND, FOOTER_COLUMNS } from "./_constants/footer";
import { CATEGORY_LINKS } from "./_constants/category_link";

export default function HomePage() {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [toastMessage, setToastMessage] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 34,
    seconds: 20,
  });

  // 1. SỬ DỤNG setTimeLeft: Bộ đếm ngược thời gian thực cho Deals of the Day
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0)
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch danh sách sản phẩm từ API
  const { data: allProductsData, isLoading } = useQuery({
    queryKey: ["home-products"],
    queryFn: () => getProducts({ pageSize: 100 }),
  });

  const allProducts = useMemo(
    () => allProductsData?.items ?? [],
    [allProductsData],
  );

  const dealProduct = useMemo(
    () => allProducts.find((p) => p.category === "phone") || allProducts[0],
    [allProducts],
  );

  const mappedProducts = useMemo(() => {
    return allProducts.slice(0, 10).map((p) => ({
      id: p.id,
      name: p.title,
      image: p.image,
      reviewCount: p.rating?.count ?? 20,
      price: p.price,
      compareAtPrice: p.price ? p.price * 1.25 : null,
      badge: { tone: "sale", label: (p.category || "TECH").toUpperCase() },
      tags: ["FREESHIP"],
      stockStatus: "in_stock",
      isWishlisted: wishlist.includes(p.id),
      original: p,
    }));
  }, [allProducts, wishlist]);

  const handleAddToCart = (product) => {
    const item = product.original || product;
    addItem(
      {
        id: item.id,
        title: item.title || item.name,
        price: item.price,
        image: item.image,
      },
      1,
    );
    setToastMessage(`Đã thêm "${item.title || item.name}" vào giỏ hàng`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id],
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-2xl shadow-xl text-xs animate-in fade-in">
          ✓ {toastMessage}
        </div>
      )}

      <main className="max-w-[1360px] mx-auto px-4 py-6 space-y-12 flex-1 w-full">
        <HeroShowcase categoryLinks={CATEGORY_LINKS} heroSlides={HERO_SLIDES} />

        <DealsOfDaySection
          product={dealProduct}
          timeLeft={timeLeft}
          onAddToCart={handleAddToCart}
        />

        {/* Best Sellers Grid */}
        <section className="space-y-4">
          <SectionHeader title="BÁN CHẠY NHẤT" viewAllHref="/products" />

          {/* 2. SỬ DỤNG isLoading: Hiển thị trạng thái loading khi tải API */}
          {isLoading ? (
            <div className="py-16 text-center text-slate-500 text-sm font-semibold flex items-center justify-center gap-2">
              <i className="fa-solid fa-spinner fa-spin text-emerald-600 text-lg" />
              <span>Đang tải danh sách sản phẩm...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mappedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onClick={() => navigate(`/product/${prod.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
