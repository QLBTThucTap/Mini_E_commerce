import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import useCartStore from "../../Stores/cartStore";
import { getProducts } from "../../Services/productService";

import ProductCard from "../../Components/product/ProductCard";
import Card from "../../Components/ui/Card";
import Badge from "../../Components/ui/Badge";
import Button from "../../Components/ui/Button";
import IconButton from "../../Components/ui/IconButton";
import PriceTag from "../../Components/ui/PriceTag";
import CategoryLink from "../../Components/common/CategoryLink";
import CountdownTimer from "../../Components/common/CountdownTimer";
import SectionHeader from "../../Components/common/SectionHeader";
import NewsletterForm from "../../Components/common/NewsletterForm";

const HERO_SLIDES = [
  {
    id: 1,
    tag: "Featured Deal",
    title: "Noise Cancelling Headphone",
    desc: "Bose Over-Ear Wireless Headphone. Low Latency Game Mode with up to 45h Extended Battery.",
    category: "headphone",
    icon: "https://bizweb.dktcdn.net/thumb/1024x1024/100/459/953/products/airpods-max-2024-5.jpg",
    bgGradient: "from-slate-100 via-slate-50 to-slate-200/80",
  },
  {
    id: 2,
    tag: "New Arrival",
    title: 'MacBook Pro 16" M3 Max',
    desc: "Unleash extreme pro performance with 36GB unified memory, Liquid Retina XDR display & 22h battery.",
    category: "laptop",
    icon: "https://bizweb.dktcdn.net/thumb/1024x1024/100/459/953/products/macbook-pro-16inch-m1-max-gray.jpg",
    bgGradient: "from-emerald-50 via-slate-50 to-teal-100/60",
  },
  {
    id: 3,
    tag: "Trending Gaming",
    title: "Ultra RTX 4090 Gaming Rig",
    desc: "Experience 4K Ray-Tracing at 165Hz+, Liquid Cooled Core i9 and ultra-quiet ARGB chassis.",
    category: "pc",
    icon: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRV2VgK6obF1fJdhV6mbx_6LbHThHnHf_EZv8UDOlj92pASJ0ktDdITN71oO0VXuJ67Dnqru9Y5hAWH3zfIPzRKNVBNx0HZeXprp1-ZtyJ_hXlPXHDZCw8tFEhYlMt9BDP4ACr8B5E&usqp=CAc",
    bgGradient: "from-indigo-50 via-slate-50 to-slate-200/80",
  },
];

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

const CATEGORY_LINKS = [
  {
    label: "SALE 40% OFF",
    icon: "fa-solid fa-fire",
    href: "/products?sort=price_asc",
    active: true,
  },
  {
    label: "Laptops",
    icon: "fa-solid fa-laptop",
    href: "/products?category=laptop",
  },
  {
    label: "PC & Computers",
    icon: "fa-solid fa-desktop",
    href: "/products?category=pc",
  },
  {
    label: "Cell Phones",
    icon: "fa-solid fa-mobile-screen-button",
    href: "/products?category=phone",
  },
  {
    label: "Tablets",
    icon: "fa-solid fa-tablet-screen-button",
    href: "/products?category=tablet",
  },
  {
    label: "Gaming & VR",
    icon: "fa-solid fa-gamepad",
    href: "/products?category=gaming",
  },
  {
    label: "Sounds & Audio",
    icon: "fa-solid fa-headphones",
    href: "/products?category=headphone",
  },
  {
    label: "Bàn Phím",
    icon: "fa-solid fa-keyboard",
    href: "/products?category=keyboard",
  },
  {
    label: "Chuột & Phụ Kiện",
    icon: "fa-solid fa-computer-mouse",
    href: "/products?category=mouse",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // States
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeBestSellerTab, setActiveBestSellerTab] = useState("best_seller");
  const [toastMessage, setToastMessage] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  // Fetch dữ liệu từ productService
  const { data: allProductsData, isLoading } = useQuery({
    queryKey: ["home-products"],
    queryFn: () => getProducts({ pageSize: 100 }),
  });

  const allProducts = useMemo(
    () => allProductsData?.items ?? [],
    [allProductsData],
  );

  // Map dữ liệu theo chuẩn của ProductCard component
  const mappedProducts = useMemo(() => {
    return allProducts.map((p) => ({
      id: p.id,
      name: p.title,
      image: p.image,
      reviewCount: p.rating?.count ?? 20,
      price: p.price,
      compareAtPrice: p.price ? p.price * 1.2 : null,
      badge: { tone: "sale", label: p.category.toUpperCase() },
      tags: ["FREE SHIPPING"],
      stockStatus: "in_stock",
      isWishlisted: wishlist.includes(p.id),
      original: p,
    }));
  }, [allProducts, wishlist]);

  const dealProduct = useMemo(
    () => allProducts.find((p) => p.category === "phone") || allProducts[0],
    [allProducts],
  );

  const bestSellerProducts = useMemo(() => {
    if (activeBestSellerTab === "new_in") return mappedProducts.slice(5, 10);
    if (activeBestSellerTab === "popular") return mappedProducts.slice(10, 15);
    return mappedProducts.slice(0, 5);
  }, [mappedProducts, activeBestSellerTab]);

  const phoneProducts = useMemo(
    () =>
      mappedProducts.filter((p) => p.original.category === "phone").slice(0, 5),
    [mappedProducts],
  );

  const laptopProducts = useMemo(
    () =>
      mappedProducts
        .filter((p) => p.original.category === "laptop")
        .slice(0, 5),
    [mappedProducts],
  );

  // Countdown timer cho Deals of the day
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 34,
    seconds: 20,
  });

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

  const showToast = (title, desc) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast("Wishlist", "Đã xóa khỏi danh sách yêu thích");
        return prev.filter((id) => id !== product.id);
      } else {
        showToast("Wishlist", "Đã thêm vào danh sách yêu thích!");
        return [...prev, product.id];
      }
    });
  };

  const handleQuickAdd = (product) => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        title: product.name || product.title,
        price: product.price,
        image: product.image,
      },
      1,
    );
    showToast("Đã thêm vào giỏ hàng!", product.name || product.title);
  };

  const handleAppSubmit = (e) => {
    e.preventDefault();
    showToast("Gửi liên kết thành công!", "Đã gửi SMS link tải app thành công");
  };

  return (
    <div className="bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white min-h-screen flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
            ✓
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wide">
              {toastMessage.title}
            </h5>
            <p className="text-xs text-slate-200 mt-0.5 line-clamp-1 max-w-xs">
              {toastMessage.desc}
            </p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="max-w-[1360px] mx-auto px-4 py-6 space-y-12 flex-1 w-full">
        {/* Section Hero Showcase */}
        <section className="grid grid-cols-12 gap-6">
          {/* Category Side Navigation */}
          <Card
            padding="p-3.5"
            className="col-span-12 lg:col-span-3 flex flex-col justify-between"
          >
            <div className="space-y-1">
              {CATEGORY_LINKS.map((item) => (
                <CategoryLink
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={item.active}
                />
              ))}
            </div>
          </Card>

          {/* Center Banner Carousel */}
          <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-6">
            {(() => {
              const slide = HERO_SLIDES[currentHeroSlide];
              return (
                <div
                  className={`col-span-12 md:col-span-8 rounded-2xl bg-gradient-to-br ${slide.bgGradient} p-8 border border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[380px] transition-all duration-300`}
                >
                  <div className="z-10 max-w-xs space-y-3">
                    <Badge tone="sale">{slide.tag}</Badge>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {slide.desc}
                    </p>
                    <div className="pt-2">
                      <Button
                        variant="primary"
                        icon="fa-solid fa-arrow-right"
                        iconPosition="right"
                        onClick={() =>
                          navigate(`/products?category=${slide.category}`)
                        }
                      >
                        MUA NGAY
                      </Button>
                    </div>
                  </div>

                  <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 opacity-90 pointer-events-none flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full border-[24px] border-slate-300/40 relative flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden p-4">
                        <img
                          src={slide.icon}
                          alt={slide.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="z-10 flex items-center justify-between pt-6 border-t border-slate-200/60 mt-4">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-white/70 px-3 py-1 rounded-full backdrop-blur-xs">
                      <span>
                        {currentHeroSlide + 1} / {HERO_SLIDES.length}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <IconButton
                        icon="fa-solid fa-chevron-left"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentHeroSlide(
                            (prev) =>
                              (prev - 1 + HERO_SLIDES.length) %
                              HERO_SLIDES.length,
                          )
                        }
                      />
                      <IconButton
                        icon="fa-solid fa-chevron-right"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentHeroSlide(
                            (prev) => (prev + 1) % HERO_SLIDES.length,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
              <Card
                hoverable
                className="flex-1 flex items-center justify-between relative overflow-hidden group"
              >
                <div className="space-y-2 z-10 max-w-[150px]">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">
                    LAPTOPS
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    MacBook Air & Pro Series
                  </h3>
                  <Link
                    to="/products?category=laptop"
                    className="inline-block mt-1 text-xs font-extrabold text-slate-900 underline decoration-emerald-500 underline-offset-4 hover:text-emerald-600"
                  >
                    MUA NGAY
                  </Link>
                </div>
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                  <img
                    src="https://bizweb.dktcdn.net/thumb/1024x1024/100/459/953/products/macbook-air-m2-gray-1.jpg"
                    alt="Laptop"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Card>

              <div className="flex-1 bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group shadow-xs">
                <div className="space-y-1.5 z-10 max-w-[140px]">
                  <Badge tone="success">SMARTPHONES</Badge>
                  <h3 className="text-sm font-extrabold leading-tight">
                    iPhone 15 Pro Max
                  </h3>
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400">CHỈ TỪ</span>
                    <PriceTag price={1199} tone="sale" size="md" />
                  </div>
                </div>
                <div className="w-20 h-20 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <img
                    src="https://bizweb.dktcdn.net/thumb/1024x1024/100/459/953/products/iphone-17-pro-cosmic-orange-1.jpg"
                    alt="Phone"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Brands */}
        <Card className="shadow-xs">
          <SectionHeader
            title="Featured Brands"
            viewAllHref="/products"
            bordered={true}
            className="mb-4"
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center opacity-70 grayscale hover:grayscale-0 transition-all">
            {[
              "JBL",
              "DIGITEK",
              "SONY",
              "MSI",
              "ROCCAT",
              "SNYK",
              "SONEX",
              "STROPIL",
            ].map((brand) => (
              <Link
                key={brand}
                to={`/products?q=${brand}`}
                className="h-10 flex items-center justify-center font-black tracking-widest text-slate-800 text-sm sm:text-base border border-slate-100 rounded-lg hover:border-emerald-400 hover:text-emerald-600 transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </Card>

        {/* Section Deals of the Day */}
        {dealProduct && (
          <Card padding="p-0" className="overflow-hidden shadow-xs">
            <div className="bg-emerald-600 text-white px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-bolt text-yellow-300 text-lg" />
                <h3 className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
                  SẢN PHẨM GIẢM GIÁ TRONG NGÀY
                </h3>
              </div>
              <Badge tone="warning">Số lượng có hạn</Badge>
            </div>

            <div className="p-6 grid grid-cols-12 gap-8 items-center">
              <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center relative min-h-[280px]">
                  <span className="absolute top-3 left-3 z-10">
                    <Badge tone="discount">GIẢM ƯU ĐÃI</Badge>
                  </span>
                  <img
                    src={dealProduct.image}
                    alt={dealProduct.title}
                    className="max-h-60 object-contain hover:scale-105 transition-transform"
                  />
                </div>
              </div>

              <div className="col-span-12 md:col-span-7 space-y-4">
                <h4 className="text-xl font-extrabold text-slate-900 leading-snug">
                  <Link
                    to={`/product/${dealProduct.id}`}
                    className="hover:text-emerald-600"
                  >
                    {dealProduct.title}
                  </Link>
                </h4>

                <PriceTag
                  price={dealProduct.price}
                  compareAtPrice={dealProduct.price * 1.25}
                  tone="sale"
                  size="lg"
                />

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {dealProduct.description}
                </p>

                <div className="pt-2">
                  <CountdownTimer
                    value={timeLeft}
                    label="Hurry Up! Promotion will expire in:"
                  />
                </div>

                <div className="pt-2 max-w-md">
                  <Button
                    variant="primary"
                    size="md"
                    icon="fa-solid fa-cart-shopping"
                    onClick={() => handleQuickAdd(dealProduct)}
                  >
                    THÊM VÀO GIỎ HÀNG NGAY
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Section Best Seller Tabs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex space-x-8 text-sm font-extrabold uppercase tracking-wide">
              {["best_seller", "new_in", "popular"].map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveBestSellerTab(tabKey)}
                  className={`pb-3 -mb-3.5 transition-colors cursor-pointer ${
                    activeBestSellerTab === tabKey
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tabKey === "best_seller"
                    ? "BÁN CHẠY NHẤT"
                    : tabKey === "new_in"
                      ? "MỚI VỀ"
                      : "NỔI BẬT"}
                </button>
              ))}
            </div>
            <Link
              className="text-xs font-bold text-slate-500 hover:text-emerald-600"
              to="/products"
            >
              Xem tất cả
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-500 text-sm font-semibold">
              <i className="fa-solid fa-spinner fa-spin mr-2 text-emerald-600" />
              Đang tải danh sách sản phẩm...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
              {bestSellerProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToWishlist={handleToggleWishlist}
                  onClick={() => navigate(`/product/${prod.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section Phones - Sử dụng ProductCard */}
        <Card className="shadow-xs space-y-6">
          <SectionHeader
            title="ĐIỆN THOẠI NỔI BẬT"
            viewAllHref="/products?category=phone"
            bordered={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {phoneProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToWishlist={handleToggleWishlist}
                onClick={() => navigate(`/product/${prod.id}`)}
              />
            ))}
          </div>
        </Card>

        {/* Section Laptops - Sử dụng ProductCard */}
        <Card className="shadow-xs space-y-6">
          <SectionHeader
            title="LAPTOPS NỔI BẬT"
            viewAllHref="/products?category=laptop"
            bordered={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {laptopProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToWishlist={handleToggleWishlist}
                onClick={() => navigate(`/product/${prod.id}`)}
              />
            ))}
          </div>
        </Card>

        {/* Section App Download & Banner */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <div className="text-3xl font-black">10% Hoàn Tiền</div>
              <p className="text-xs text-emerald-100 max-w-[220px]">
                Nhận 10% hoàn tiền với thẻ thành viên LH Tech Mart.
              </p>
              <Link
                className="text-xs font-extrabold underline text-white hover:text-emerald-200 inline-block pt-2"
                to="/products"
              >
                Tìm hiểu thêm
              </Link>
            </div>
            <div className="w-24 h-16 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center text-xs font-extrabold tracking-widest text-white shadow-lg">
              LH-CARD
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-extrabold">Download our app</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your phone number and we'll send you a download link.
                </p>
              </div>
              <span className="text-3xl">📱</span>
            </div>
            <div className="mt-4">
              <NewsletterForm
                placeholder="(+84) 091 234 567..."
                buttonLabel="SEND LINK"
                onSubmit={handleAppSubmit}
                dark={true}
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
