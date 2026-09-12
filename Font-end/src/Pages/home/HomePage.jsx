import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Heart,
  User as UserIcon,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Flame,
  Laptop,
  Cpu,
  Smartphone,
  Tablet,
  Gamepad2,
  Wifi,
  Camera,
  Headphones,
  Printer,
  HardDrive,
  Plug,
  ArrowRight,
  Zap,
  Star,
  Sparkles,
  Share2,
} from "lucide-react";
import useCartStore from "../../Stores/cartStore";
import useAuthStore from "../../Stores/authStore";

const HERO_SLIDES = [
  {
    id: 1,
    tag: "Featured Deal",
    title: "Noise Cancelling Headphone",
    desc: "Bose Over-Ear Wireless Headphone. Low Latency Game Mode with up to 45h Extended Battery.",
    category: "headphone",
    icon: "🎧",
    bgGradient: "from-slate-100 via-slate-50 to-slate-200/80",
  },
  {
    id: 2,
    tag: "New Arrival",
    title: "MacBook Pro 16\" M3 Max",
    desc: "Unleash extreme pro performance with 36GB unified memory, Liquid Retina XDR display & 22h battery.",
    category: "laptop",
    icon: "💻",
    bgGradient: "from-emerald-50 via-slate-50 to-teal-100/60",
  },
  {
    id: 3,
    tag: "Trending Gaming",
    title: "Ultra RTX 4090 Gaming Rig",
    desc: "Experience 4K Ray-Tracing at 165Hz+, Liquid Cooled Core i9 and ultra-quiet ARGB chassis.",
    category: "pc",
    icon: "🖥️",
    bgGradient: "from-indigo-50 via-slate-50 to-slate-200/80",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  // Stores
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // States
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeBestSellerTab, setActiveBestSellerTab] = useState("best_seller");
  const [searchCategory, setSearchCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [appPhone, setAppPhone] = useState("");
  const [isSeoExpanded, setIsSeoExpanded] = useState(false);

  // Countdown timer for Deals of the day
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    mins: 34,
    secs: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (title, desc) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickAdd = (product) => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
      1,
    );
    showToast("Đã thêm vào giỏ hàng!", product.title);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchCategory !== "All Categories") {
      const catMap = {
        "Laptops & PC": "laptop",
        Smartphones: "phone",
        "Audio & Visual": "headphone",
        "Gaming Gear": "keyboard",
      };
      if (catMap[searchCategory]) params.set("category", catMap[searchCategory]);
    }
    navigate(`/products?${params.toString()}`);
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

      {/* BEGIN: TopBar */}
      <div className="border-b border-slate-200/80 bg-white text-xs text-slate-500" data-purpose="top-utility-bar">
        <div className="max-w-[1360px] mx-auto px-4 h-10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">Hotline 24/7</span>
              <a href="tel:0824781531" className="font-bold text-slate-800 hover:text-emerald-600 cursor-pointer transition-colors">
                (025) 3686 25 16 - 0824781531
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link className="hover:text-emerald-600 transition-colors" to="/products">
              Sell on Swoo
            </Link>
            <span className="text-slate-300">|</span>
            <Link className="hover:text-emerald-600 transition-colors" to="/account?tab=orders">
              Order Tracking
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-emerald-600">
              <span className="font-semibold text-slate-700">USD</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center space-x-1.5 cursor-pointer hover:text-emerald-600">
              <span className="w-4 h-3 bg-red-600 rounded-xs inline-flex overflow-hidden relative shadow-xs">
                <span className="absolute inset-x-0 top-1/3 bottom-1/3 bg-white" />
                <span className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-700" />
              </span>
              <span className="font-semibold text-slate-700">VN / Eng</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
      {/* END: TopBar */}

      {/* BEGIN: MainHeader */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40" data-purpose="main-header">
        <div className="max-w-[1360px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Brand Identity Logo */}
            <div className="flex items-center space-x-8">
              <Link className="flex items-center space-x-2.5 group" to="/">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  S
                </div>
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                    SWOO
                  </div>
                  <div className="text-[10px] tracking-widest font-bold text-emerald-600 uppercase mt-0.5">
                    TECH MART
                  </div>
                </div>
              </Link>
              {/* Category Links */}
              <nav className="hidden xl:flex items-center space-x-6 text-sm font-semibold text-slate-700">
                <Link to="/" className="flex items-center space-x-1 cursor-pointer text-emerald-600">
                  <span>HOMES</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
                <Link to="/products" className="flex items-center space-x-1 cursor-pointer hover:text-emerald-600 transition-colors">
                  <span>PAGES</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
                <Link to="/products" className="flex items-center space-x-1 cursor-pointer hover:text-emerald-600 transition-colors">
                  <span>PRODUCTS</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
                <a className="hover:text-emerald-600 transition-colors" href="#contact">
                  CONTACT
                </a>
              </nav>
            </div>

            {/* Global Search Bar with Category Filter */}
            <div className="flex-1 max-w-2xl">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center rounded-xl border-2 border-emerald-600/90 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/30 transition-all"
              >
                <div className="relative flex items-center border-r border-slate-200 px-3.5 py-2.5 bg-slate-50/50">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="appearance-none bg-transparent pr-7 pl-1 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer border-0"
                  >
                    <option>All Categories</option>
                    <option>Laptops & PC</option>
                    <option>Smartphones</option>
                    <option>Audio & Visual</option>
                    <option>Gaming Gear</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-0 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none"
                  placeholder="Search products, brands, model numbers..."
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            </div>

            {/* User Controls: Wishlist, Account, Cart */}
            <div className="flex items-center space-x-6">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="relative p-2 text-slate-700 hover:text-emerald-600 transition-colors rounded-full hover:bg-slate-100 cursor-pointer"
                title="Wishlist"
              >
                <Heart className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600" />
              </button>

              {/* User Profile Brief */}
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <div className="text-slate-400 font-medium uppercase">
                    {isAuthenticated ? "Tài khoản" : "WELCOME"}
                  </div>
                  <div className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    {isAuthenticated
                      ? user?.fullName || user?.username || "Cá nhân"
                      : "LOG IN / REGISTER"}
                  </div>
                </div>
              </Link>

              {/* Mini Cart Trigger */}
              <Link
                to="/cart"
                className="flex items-center space-x-3 pl-2 cursor-pointer group"
              >
                <div className="relative w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white group-hover:bg-slate-900">
                    {cartCount}
                  </span>
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="text-slate-400 uppercase font-semibold text-[10px]">
                    CART
                  </div>
                  <div className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    ${cartTotal.toFixed(2)}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Benefit Strip */}
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2">
          <div className="max-w-[1360px] mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-200" />
              <span>FREE SHIPPING OVER $199</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-emerald-200" />
              <span>30 DAYS MONEY BACK GUARANTEE</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>100% SECURE CHECKOUT</span>
            </div>
          </div>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: MainContent */}
      <main className="max-w-[1360px] mx-auto px-4 py-6 space-y-12 flex-1 w-full">
        {/* BEGIN: HeroShowcaseSection */}
        <section className="grid grid-cols-12 gap-6" data-purpose="hero-carousel-and-sidebar">
          {/* Category Side Navigation */}
          <aside className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 flex flex-col justify-between">
            <div className="space-y-1">
              <Link
                to="/products?sort=price_asc"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4" /> SALE 40% OFF
                </span>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </Link>
              <Link
                to="/products?category=laptop"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Laptop className="w-4 h-4 text-slate-400" /> Laptops
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=pc"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-slate-400" /> PC & Computers
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=phone"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-slate-400" /> Cell Phones
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=tablet"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Tablet className="w-4 h-4 text-slate-400" /> Tablets
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=gaming"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-slate-400" /> Gaming & VR
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=network"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 text-slate-400" /> Networking
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=camera"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Camera className="w-4 h-4 text-slate-400" /> Cameras
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=headphone"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Headphones className="w-4 h-4 text-slate-400" /> Sounds
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=office"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-slate-400" /> Office Equipment
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=storage"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-slate-400" /> Storage & USB
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/products?category=accessories"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Plug className="w-4 h-4 text-slate-400" /> Accessories
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 px-2">
              <Link
                to="/products?sort=price_asc"
                className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider flex items-center justify-between"
              >
                <span>Clearance Outlet</span>
                <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px]">
                  UP TO -70%
                </span>
              </Link>
            </div>
          </aside>

          {/* Center & Right Feature Banners */}
          <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-6">
            {/* Big Hero Banner */}
            {(() => {
              const slide = HERO_SLIDES[currentHeroSlide];
              return (
                <div
                  className={`col-span-12 md:col-span-8 rounded-2xl bg-gradient-to-br ${slide.bgGradient} p-8 border border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[380px] transition-all duration-300`}
                >
                  <div className="z-10 max-w-xs space-y-3">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wide">
                      {slide.tag}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {slide.desc}
                    </p>
                    <div className="pt-2">
                      <Link
                        to={`/products?category=${slide.category}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all hover:gap-3 cursor-pointer"
                      >
                        <span>BUY NOW</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Graphic Visual */}
                  <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 opacity-90 pointer-events-none flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full border-[24px] border-slate-300/40 relative flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 shadow-2xl flex items-center justify-center text-slate-600 font-black text-6xl">
                        {slide.icon}
                      </div>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="z-10 flex items-center justify-between pt-6 border-t border-slate-200/60 mt-4">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-white/70 px-3 py-1 rounded-full backdrop-blur-xs">
                      <span>{currentHeroSlide + 1} / {HERO_SLIDES.length}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentHeroSlide(
                            (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Right Side Dual Cards */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
              {/* Watch Card */}
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between relative overflow-hidden group hover:border-emerald-300 transition-all shadow-xs">
                <div className="space-y-2 z-10 max-w-[150px]">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">
                    XIAOMI
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    Sport Water Resistance Watch
                  </h3>
                  <Link
                    to="/products?category=watch"
                    className="inline-block mt-1 text-xs font-extrabold text-slate-900 underline decoration-emerald-500 underline-offset-4 hover:text-emerald-600"
                  >
                    SHOP NOW
                  </Link>
                </div>
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                  ⌚
                </div>
              </div>

              {/* Action Cam / Dark Banner */}
              <div className="flex-1 bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group shadow-xs">
                <div className="space-y-1.5 z-10 max-w-[140px]">
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                    OKODO
                  </span>
                  <h3 className="text-sm font-extrabold leading-tight">
                    HERO 11+ BLACK
                  </h3>
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400">FROM</span>
                    <div className="text-lg font-black text-white leading-none">
                      $169
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  📷
                </div>
              </div>
            </div>

            {/* Secondary Row for 2 sub-promos */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div>
                  <div className="text-xs text-slate-500 font-semibold">
                    Sono Playgo 5
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    from{" "}
                    <span className="text-emerald-600 font-extrabold">$569</span>
                  </div>
                  <Link
                    to="/products?category=headphone"
                    className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wide mt-2 inline-block underline decoration-slate-300 hover:text-emerald-600"
                  >
                    Discover Now
                  </Link>
                </div>
                <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
                  🔊
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    Logitek Bluetooth
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    Wireless Slim Keyboard
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                    Best for all devices
                  </span>
                </div>
                <div className="w-24 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-3xl">
                  ⌨️
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: HeroShowcaseSection */}

        {/* BEGIN: FeaturedBrandsAndTopCategories */}
        <section className="space-y-6" data-purpose="brands-and-categories">
          {/* Brand Logos Row */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Featured Brands
              </h3>
              <Link
                to="/products"
                className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center opacity-70 grayscale hover:grayscale-0 transition-all">
              {["JBL", "DIGITEK", "SONY", "MSI", "ROCCAT", "SNYK", "SONEX", "STROPIL"].map((brand) => (
                <Link
                  key={brand}
                  to={`/products?q=${brand}`}
                  className="h-10 flex items-center justify-center font-black tracking-widest text-slate-800 text-sm sm:text-base border border-slate-100 rounded-lg hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Top Categories Visual Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Top Categories
              </h3>
              <div className="flex items-center space-x-2">
                <Link
                  to="/products"
                  className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors mr-3"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Laptops", icon: "💻", key: "laptop" },
                { name: "PC Gaming", icon: "🖥️", key: "pc" },
                { name: "Headphones", icon: "🎧", key: "headphone" },
                { name: "Monitors", icon: "📺", key: "monitor" },
              ].map((cat) => (
                <Link
                  key={cat.key}
                  to={`/products?category=${cat.key}`}
                  className="p-4 rounded-xl border border-slate-100 hover:border-emerald-500 bg-slate-50/60 flex flex-col items-center text-center cursor-pointer transition-all group"
                >
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-xs flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* END: FeaturedBrandsAndTopCategories */}

        {/* BEGIN: DealsOfTheDay */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs" data-purpose="deals-of-the-day-countdown">
          <div className="bg-emerald-600 text-white px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 fill-current text-yellow-300" />
              <h3 className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
                DEALS OF THE DAY
              </h3>
            </div>
            <div className="text-xs font-bold text-emerald-100">
              Limited inventory remaining
            </div>
          </div>
          <div className="p-6 grid grid-cols-12 gap-8 items-center">
            {/* Left: Product Photo & Thumbnails */}
            <div className="col-span-12 md:col-span-5 flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-lg border-2 border-emerald-500 bg-slate-50 flex items-center justify-center text-lg cursor-pointer">
                  📱
                </div>
                <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-lg cursor-pointer hover:border-emerald-500">
                  📱
                </div>
                <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-lg cursor-pointer hover:border-emerald-500">
                  📱
                </div>
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center relative min-h-[280px]">
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-2 py-1 rounded-md">
                  SAVE $190.00
                </span>
                <div className="text-7xl">📱</div>
              </div>
            </div>

            {/* Middle: Product Details & Countdown */}
            <div className="col-span-12 md:col-span-7 space-y-4">
              <div className="flex items-center space-x-2 text-xs text-amber-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400 font-medium">(12 reviews)</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 leading-snug">
                Xioma Redmi Note 11 Pro 256GB 2023, Black Smartphone
              </h4>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-emerald-600">$569.00</span>
                <span className="text-base font-semibold text-slate-400 line-through">
                  $759.00
                </span>
              </div>
              <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
                <li>Intel LGA 1700 Socket: Supports 13th & 12th Gen Intel Core</li>
                <li>DDR5 Compatible: 4*SMD DIMMs with XMP 3.0 Memory</li>
                <li>Commanding Power Design: Twin 16+1+2 Phases Digital VRM</li>
              </ul>
              <div className="flex items-center space-x-3 pt-1">
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-200 uppercase">
                  Free Shipping
                </span>
                <span className="bg-red-50 text-red-600 text-[11px] font-bold px-2.5 py-1 rounded-md border border-red-200 uppercase">
                  Free Gift Included
                </span>
              </div>

              {/* Countdown Boxes */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Hurry Up! Promotion will expires in:
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center leading-none">
                    <span className="text-lg font-black text-slate-900">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">
                      Days
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center leading-none">
                    <span className="text-lg font-black text-slate-900">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">
                      Hours
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center leading-none">
                    <span className="text-lg font-black text-slate-900">
                      {timeLeft.mins}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">
                      Mins
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center leading-none">
                    <span className="text-lg font-black text-slate-900">
                      {timeLeft.secs}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">
                      Secs
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Progress & Quick Add */}
              <div className="pt-2 max-w-md flex flex-col gap-3">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">
                    Sold: <strong className="text-slate-800">26/75</strong>
                  </span>
                  <span className="text-emerald-600">35% claimed</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[35%]" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAdd({
                        id: 2,
                        title: "Xioma Redmi Note 11 Pro 256GB 2023",
                        price: 569,
                        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
                      })
                    }
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    ADD TO CART NOW
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Prime Membership Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-6 py-3 text-white text-xs font-semibold flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>
                Member get <strong>FREE SHIPPING*</strong> with no order minimum! *Restriction apply
              </span>
            </div>
            <Link className="underline font-bold text-white hover:text-yellow-200 transition-colors" to="/products">
              Try free 30-days trial
            </Link>
          </div>
        </section>
        {/* END: DealsOfTheDay */}

        {/* BEGIN: BestSellerTabsAndProducts */}
        <section className="space-y-6" data-purpose="product-tabs-showcase">
          {/* Tabs Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex space-x-8 text-sm font-extrabold uppercase tracking-wide">
              <button
                type="button"
                onClick={() => setActiveBestSellerTab("best_seller")}
                className={`pb-3 -mb-3.5 transition-colors cursor-pointer ${
                  activeBestSellerTab === "best_seller"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                BEST SELLER
              </button>
              <button
                type="button"
                onClick={() => setActiveBestSellerTab("new_in")}
                className={`pb-3 -mb-3.5 transition-colors cursor-pointer ${
                  activeBestSellerTab === "new_in"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                NEW IN
              </button>
              <button
                type="button"
                onClick={() => setActiveBestSellerTab("popular")}
                className={`pb-3 -mb-3.5 transition-colors cursor-pointer ${
                  activeBestSellerTab === "popular"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                POPULAR
              </button>
            </div>
            <Link className="text-xs font-bold text-slate-500 hover:text-emerald-600" to="/products">
              View All
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                id: 3,
                tag: "NEW",
                tagColor: "bg-emerald-600",
                icon: "🎧",
                reviews: 152,
                title: "BOSO 2 Wireless On Ear Headphone",
                price: 359.0,
                freeShipping: true,
                stock: true,
              },
              {
                id: 2,
                tag: "SAVE $199",
                tagColor: "bg-red-500",
                icon: "📱",
                reviews: 152,
                title: "OPod Pro 12.9 Inch M1 2023, 64GB + Wifi, GPS",
                price: 569.0,
                oldPrice: 759.0,
                freeShipping: true,
                stock: true,
              },
              {
                id: 6,
                tag: "SAVE $59",
                tagColor: "bg-emerald-600",
                icon: "💻",
                reviews: 8,
                title: "uLosk Mini Case 2.0, Xenon i10 / 32GB / SSD 512GB",
                price: 1729.0,
                oldPrice: 2119.0,
                freeShipping: true,
                stock: false,
              },
              {
                id: 7,
                tag: "",
                icon: "⌚",
                reviews: 41,
                title: "Opgio Watch Series 8 GPS + Cellular Stainless Steel Case",
                price: 979.0,
                priceRange: "$979.00 - $1,259.00",
                shippingNote: "$2.98 SHIPPING",
                stock: "pre_order",
              },
              {
                id: 8,
                tag: "SAVE $3.00",
                tagColor: "bg-emerald-600",
                icon: "🔌",
                reviews: 9,
                title: "iSmart 24V Fast Charger Dual Port Adapter",
                price: 9.0,
                oldPrice: 12.0,
                shippingNote: "$1.98 SHIPPING",
                stock: true,
              },
            ].map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-300 transition-all group"
              >
                <div>
                  <div className="relative bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[160px] mb-3">
                    {prod.tag && (
                      <span className={`absolute top-2 left-2 ${prod.tagColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}>
                        {prod.tag}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => showToast("Wishlist", "Đã thêm vào danh sách yêu thích!")}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <div className="text-5xl group-hover:scale-105 transition-transform">
                      {prod.icon}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mb-1">
                    ({prod.reviews})
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                    {prod.title}
                  </h5>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-sm font-black text-slate-900">
                      ${prod.price.toFixed(2)}
                    </span>
                    {prod.oldPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ${prod.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {prod.freeShipping && (
                      <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                        FREE SHIPPING
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    {prod.stock === true ? (
                      <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
                      </div>
                    ) : prod.stock === false ? (
                      <div className="text-[10px] font-semibold text-red-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Out of stock
                      </div>
                    ) : (
                      <div className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pre - Order
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(prod)}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                    >
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* END: BestSellerTabsAndProducts */}

        {/* BEGIN: BrandNewForYouCards */}
        <section className="space-y-4" data-purpose="brand-new-promotions">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              BRAND NEW FOR YOU
            </h3>
            <div className="flex space-x-1.5">
              <button
                type="button"
                className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Spotlight Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-44 bg-slate-900 p-4 flex flex-col justify-between relative">
                <div className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                  ZUMAX
                </div>
                <div className="text-4xl self-center my-auto">🖥️</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  Green Steel Mid Tower Case
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">
                  Zumac Steel Computer Case
                </h4>
                <p className="text-xs text-slate-500">
                  And an option to upgrade every three years with concierge warranty.
                </p>
                <Link
                  className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase"
                  to="/products?category=pc"
                >
                  Shop Now →
                </Link>
              </div>
            </div>

            {/* Spotlight Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-44 bg-blue-900 p-4 flex flex-col justify-between relative text-white">
                <div className="text-yellow-400 font-extrabold text-xs uppercase tracking-wider">
                  VIEWSONIC
                </div>
                <div className="text-4xl self-center my-auto">🖥️</div>
                <div className="text-[10px] text-blue-200 font-semibold uppercase">
                  200Hz Curved Gaming Monitor
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">
                  Summer Sale: Up to 50% Off Display
                </h4>
                <p className="text-xs text-slate-500">
                  Limited time offer. Hurry up while stock lasts for esports grade monitors.
                </p>
                <Link
                  className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase"
                  to="/products?category=monitor"
                >
                  Shop Now →
                </Link>
              </div>
            </div>

            {/* Spotlight Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-44 bg-slate-800 p-4 flex flex-col justify-between relative text-white">
                <div className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                  SALE OFF 50%
                </div>
                <div className="text-4xl self-center my-auto">💺</div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase">
                  Form Foam Gaming Chair
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">
                  Ergonomic Gaming Chair Series
                </h4>
                <p className="text-xs text-slate-500">
                  Memory foam cushioning with 4D armrests & active lumbar support.
                </p>
                <Link
                  className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase"
                  to="/products"
                >
                  Shop Now →
                </Link>
              </div>
            </div>

            {/* Spotlight Card 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-44 bg-amber-500 p-4 flex flex-col justify-between relative text-slate-950">
                <div className="text-slate-900 font-black text-xs uppercase tracking-wider">
                  APPLE DEALS
                </div>
                <div className="text-4xl self-center my-auto">📱</div>
                <div className="text-[10px] text-slate-900 font-bold uppercase">
                  Powerful I in Hand
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">iPod Pro Mini 6</h4>
                <p className="text-xs text-slate-500">
                  From $19.99/month for 36 months or $280.35 final settlement payment.
                </p>
                <Link
                  className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase"
                  to="/products?category=phone"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* END: BrandNewForYouCards */}

        {/* BEGIN: TopCellphonesAndTablets */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs" data-purpose="smartphones-category-block">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              TOP CELLPHONES & TABLETS
            </h3>
            <Link className="text-xs font-bold text-slate-500 hover:text-emerald-600" to="/products?category=phone">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center">
            {/* Big Billboard Banner */}
            <div className="col-span-12 lg:col-span-7 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white flex items-center justify-between relative overflow-hidden">
              <div className="space-y-3 z-10 max-w-xs">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  FLAGSHIP LAUNCH
                </span>
                <h4 className="text-2xl sm:text-3xl font-black">
                  REDMI NOTE 12 PRO+ 5G
                </h4>
                <p className="text-xs text-slate-300">
                  Rise to the challenge with 200MP ultra-clear camera system.
                </p>
                <Link
                  className="inline-block px-4 py-2 bg-white text-slate-900 text-xs font-black rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
                  to="/products?category=phone"
                >
                  SHOP NOW
                </Link>
              </div>
              <div className="flex space-x-2 text-5xl">
                <span>📱</span>
                <span>📱</span>
              </div>
            </div>

            {/* Subcategory Links */}
            <div className="col-span-12 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "iPhone (iOS)", count: "74 items", icon: "📱", q: "iphone" },
                { name: "Android", count: "35 Items", icon: "🤖", q: "android" },
                { name: "5G Support", count: "12 items", icon: "📶", q: "5g" },
                { name: "Gaming Phone", count: "9 items", icon: "🎮", q: "gaming" },
                { name: "Xiaomi", count: "52 items", icon: "📱", q: "xiaomi" },
                { name: "Accessories", count: "29 items", icon: "🎧", q: "accessories" },
              ].map((sub) => (
                <Link
                  key={sub.name}
                  to={`/products?q=${sub.q}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{sub.name}</div>
                    <div className="text-[10px] text-slate-400">{sub.count}</div>
                  </div>
                  <span className="text-lg">{sub.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Smartphone Products Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
            {[
              { id: 2, title: "SROK Smart Phone 128GB, OLED Retina", price: 579, oldPrice: 659, badge: "SAVE $199", reviews: 152 },
              { id: 9, title: "aPod Pro Tablet 2023 LTE + Wifi 12.9 Inch", price: 979, badge: "NEW", reviews: 82 },
              { id: 10, title: "OPod Pro 12.9 Inch M1 2023, 64GB + Wifi", price: 659, reviews: 5 },
              { id: 11, title: "Xiamoi Redmi Note 5, 64GB Silver", price: 1239, oldPrice: 1619, badge: "SAVE $59", reviews: 9 },
              { id: 12, title: "Microsute Alpha Ultra S5 Surface 128GB 2022", price: 1729, reviews: 3 },
            ].map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-100 p-3 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 bg-slate-50 rounded-lg flex items-center justify-center text-4xl mb-2 relative">
                    {p.badge && (
                      <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded">
                        {p.badge}
                      </span>
                    )}
                    📱
                  </div>
                  <div className="text-[10px] text-slate-400">({p.reviews})</div>
                  <h6 className="text-xs font-bold text-slate-800 line-clamp-2">
                    {p.title}
                  </h6>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="text-xs font-black text-emerald-600">
                    ${p.price.toFixed(2)}{" "}
                    {p.oldPrice && (
                      <span className="line-through text-slate-400 font-normal">
                        ${p.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-emerald-600 font-bold">● In stock</span>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(p)}
                      className="text-[10px] font-bold text-slate-600 hover:text-emerald-600 cursor-pointer"
                    >
                      + Giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* END: TopCellphonesAndTablets */}

        {/* BEGIN: BestLaptopsAndComputers */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs" data-purpose="laptops-computers-block">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              BEST LAPTOPS & COMPUTERS
            </h3>
            <Link className="text-xs font-bold text-slate-500 hover:text-emerald-600" to="/products?category=laptop">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between relative overflow-hidden">
              <div className="space-y-3 z-10 max-w-xs">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  NEXT-GEN PERFORMANCE
                </span>
                <h4 className="text-2xl sm:text-3xl font-black">
                  Mobok 2 Supercharged By M2
                </h4>
                <div className="text-sm text-slate-300">
                  Start from <span className="text-emerald-400 font-bold">$1,199</span>
                </div>
                <Link
                  className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-black rounded-lg hover:bg-emerald-700 transition-colors"
                  to="/products?category=laptop"
                >
                  DISCOVER NOW
                </Link>
              </div>
              <div className="text-6xl">💻</div>
            </div>

            <div className="col-span-12 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Macbook", count: "74 items", icon: "💻", q: "macbook" },
                { name: "Gaming PC", count: "5 items", icon: "🖥️", q: "gaming" },
                { name: "Laptop Office", count: "22 items", icon: "💼", q: "office" },
                { name: "Laptop 15\"", count: "55 items", icon: "💻", q: "laptop" },
                { name: "M1 2023", count: "32 items", icon: "⚡", q: "m1" },
                { name: "Secondhand", count: "16 items", icon: "🔄", q: "used" },
              ].map((sub) => (
                <Link
                  key={sub.name}
                  to={`/products?q=${sub.q}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{sub.name}</div>
                    <div className="text-[10px] text-slate-400">{sub.count}</div>
                  </div>
                  <span className="text-lg">{sub.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
            {[
              { id: 1, title: "Pineapple MacBook Pro 2022 M1 / 512 GB", price: 579, badge: "NEW", reviews: 152, icon: "💻" },
              { id: 13, title: "C&O Bluetooth Desktop Speaker", price: 979, badge: "NEW", reviews: 12, icon: "🔊" },
              { id: 14, title: "Gigaby Custom Case, i7 / 16GB / SSD 256GB", price: 1259, reviews: 5, icon: "🖥️" },
              { id: 15, title: "BEOS PC Gaming Case Tower", price: 1239, oldPrice: 1619, badge: "SAVE $59", reviews: 9, icon: "🖥️" },
              { id: 16, title: "aMoc All-in-one Computer M1 Display", price: 1729, reviews: 8, icon: "🖥️" },
            ].map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-100 p-3 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 bg-slate-50 rounded-lg flex items-center justify-center text-4xl mb-2 relative">
                    {p.badge && (
                      <span className="absolute top-1 left-1 bg-slate-900 text-white text-[9px] font-bold px-1 rounded">
                        {p.badge}
                      </span>
                    )}
                    {p.icon}
                  </div>
                  <div className="text-[10px] text-slate-400">({p.reviews})</div>
                  <h6 className="text-xs font-bold text-slate-800 line-clamp-2">
                    {p.title}
                  </h6>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="text-xs font-black text-slate-900">
                    ${p.price.toFixed(2)}{" "}
                    {p.oldPrice && (
                      <span className="line-through text-slate-400 font-normal">
                        ${p.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-emerald-600 font-bold">● In stock</span>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(p)}
                      className="text-[10px] font-bold text-slate-600 hover:text-emerald-600 cursor-pointer"
                    >
                      + Giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* END: BestLaptopsAndComputers */}

        {/* BEGIN: TripleCategoryVisualBanners */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6" data-purpose="category-showcase-banners">
          {/* Audios & Cameras */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
            <div className="z-10 space-y-1">
              <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">
                AUDIOS & CAMERAS
              </div>
              <h4 className="text-xl font-black">Best Speaker 2023</h4>
            </div>
            <div className="z-10">
              <Link
                className="text-xs font-bold text-white underline decoration-emerald-500 underline-offset-4 hover:text-emerald-400"
                to="/products?category=headphone"
              >
                View All
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-80 group-hover:scale-105 transition-transform">
              🔊
            </div>
          </div>

          {/* Gaming Gear */}
          <div className="bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-900 rounded-2xl p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden group border border-slate-200">
            <div className="z-10 space-y-1">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                GAMING
              </div>
              <h4 className="text-xl font-black">WIRELESS RGB GAMING MOUSE</h4>
            </div>
            <div className="z-10">
              <Link
                className="text-xs font-bold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-emerald-600"
                to="/products?category=mouse"
              >
                View All
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-80 group-hover:scale-105 transition-transform">
              🖱️
            </div>
          </div>

          {/* Office Equipments */}
          <div className="bg-slate-850 text-white rounded-2xl p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
            <div className="z-10 space-y-1">
              <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">
                OFFICE EQUIPMENTS
              </div>
              <h4 className="text-xl font-black">Laser 4K Home Theater Projector</h4>
            </div>
            <div className="z-10">
              <Link
                className="text-xs font-bold text-white underline decoration-emerald-500 underline-offset-4 hover:text-emerald-400"
                to="/products?category=office"
              >
                View All
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-80 group-hover:scale-105 transition-transform">
              📽️
            </div>
          </div>
        </section>
        {/* END: TripleCategoryVisualBanners */}

        {/* BEGIN: IconCategorySubGrid */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs" data-purpose="quick-category-icons">
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-4 text-center">
            {[
              { name: "Speaker", count: "12 items", icon: "🔊", key: "headphone" },
              { name: "DSLR Camera", count: "9 items", icon: "📷", key: "camera" },
              { name: "Monitors", count: "28 items", icon: "🖥️", key: "monitor" },
              { name: "Chair", count: "12 items", icon: "💺", key: "gaming" },
              { name: "Printers", count: "9 items", icon: "🖨️", key: "office" },
              { name: "Network", count: "90 items", icon: "📡", key: "network" },
              { name: "Earbuds", count: "5 items", icon: "🎧", key: "headphone" },
              { name: "Microphone", count: "12 items", icon: "🎙️", key: "headphone" },
              { name: "Controller", count: "9 items", icon: "🎮", key: "gaming" },
              { name: "Keyboards", count: "30 items", icon: "⌨️", key: "keyboard" },
            ].map((item) => (
              <Link
                key={item.name}
                to={`/products?category=${item.key}`}
                className="flex flex-col items-center space-y-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl group-hover:bg-emerald-100 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* END: IconCategorySubGrid */}

        {/* BEGIN: PerksAndAppDownloadBanner */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6" data-purpose="cashback-and-app-download">
          {/* 10% Cashback Card */}
          <div className="md:col-span-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <div className="text-3xl font-black">10% Back</div>
              <p className="text-xs text-emerald-100 max-w-[220px]">
                Earn 10% Cash back on Swootech products with Swoo Card.
              </p>
              <Link
                className="text-xs font-extrabold underline text-white hover:text-emerald-200 inline-block pt-2"
                to="/products"
              >
                Learn How
              </Link>
            </div>
            <div className="w-24 h-16 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center text-xs font-extrabold tracking-widest text-white shadow-lg">
              SWATEK
            </div>
          </div>

          {/* Download App Input */}
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (appPhone.trim()) {
                  showToast("Gửi liên kết thành công!", `Đã gửi SMS link tải app tới: ${appPhone}`);
                  setAppPhone("");
                }
              }}
              className="mt-4 flex gap-2"
            >
              <input
                type="tel"
                value={appPhone}
                onChange={(e) => setAppPhone(e.target.value)}
                className="flex-1 bg-slate-800 border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2.5"
                placeholder="(+84) 091 234 567..."
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                SEND LINK
              </button>
            </form>
          </div>
        </section>
        {/* END: PerksAndAppDownloadBanner */}

        {/* BEGIN: RecentlyViewedCarousel */}
        <section className="space-y-4" data-purpose="recently-viewed-products">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              YOUR RECENTLY VIEWED
            </h3>
            <Link className="text-xs font-bold text-slate-500 hover:text-emerald-600" to="/products">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Xiamoi Remid 8 Sport Water Watch", price: "$579.00", icon: "⌚" },
              { title: "Microsute Surface 2.0 Laptop", price: "$979.00", icon: "💻" },
              { title: "aPod Pro Tablet 2023 LTE", price: "$979.00 - $1,259.00", icon: "📱" },
              { title: "SROK Smart Phone 128GB", price: "$579.00", oldPrice: "$770.00", icon: "📱" },
            ].map((p, i) => (
              <Link
                key={i}
                to="/products"
                className="bg-white rounded-xl border border-slate-200 p-3 flex items-center space-x-3 hover:border-emerald-300 transition-all group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {p.icon}
                </div>
                <div className="overflow-hidden">
                  <h6 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-600">
                    {p.title}
                  </h6>
                  <div className="text-xs font-black text-slate-900 mt-1">
                    {p.price}{" "}
                    {p.oldPrice && (
                      <span className="line-through text-slate-400 text-[10px] font-normal">
                        {p.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* END: RecentlyViewedCarousel */}

        {/* BEGIN: SeoMarketplaceNarrative */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs text-slate-500 leading-relaxed shadow-xs" data-purpose="seo-footer-text">
          <h4 className="text-sm font-bold text-slate-800">
            Swoo – #1 Online Marketplace for technology & electronic appliances
          </h4>
          <p>
            Chào mừng bạn đến với <strong>SWOO Tech Mart</strong> – Trung tâm mua sắm thiết bị công nghệ hàng đầu. Chúng tôi cung cấp các sản phẩm Laptop, Điện thoại thông minh, PC Gaming, Phụ kiện máy tính, Đồng hồ thông minh và Thiết bị âm thanh cao cấp chính hãng 100% với chính sách bảo hành chu đáo, đổi trả trong 30 ngày và giao hàng miễn phí toàn quốc cho đơn hàng từ $199.
          </p>
          {isSeoExpanded && (
            <p className="animate-in fade-in duration-200">
              Với hàng nghìn sản phẩm đa dạng từ Apple, Sony, Samsung, Dell, Asus, Logitech, Xiaomi, Anker, quý khách luôn có thể tìm thấy mức giá ưu đãi nhất cùng chế độ bảo mật thanh toán chuẩn quốc tế 256-Bit SSL. Đội ngũ chăm sóc khách hàng 24/7 luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc và xử lý đơn hàng nhanh chóng nhất.
            </p>
          )}
          <button
            type="button"
            onClick={() => setIsSeoExpanded(!isSeoExpanded)}
            className="text-emerald-600 font-bold inline-block hover:underline cursor-pointer"
          >
            {isSeoExpanded ? "Thu gọn ▲" : "View All ▼"}
          </button>
        </section>
        {/* END: SeoMarketplaceNarrative */}
      </main>
      {/* END: MainContent */}

      {/* BEGIN: SiteFooter */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-12 mt-16" data-purpose="main-footer">
        <div className="max-w-[1360px] mx-auto px-4">
          {/* Top Columns: Company & Link Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12">
            {/* Brand & Contact Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
                SWOO - 1ST NYC TECH ONLINE MARKET
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">HOTLINE 24/7</div>
                <div className="text-2xl font-black text-emerald-600 tracking-tight mt-0.5">
                  (025) 3686 25 16
                </div>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                257 Thatcher Road St, Brooklyn, Manhattan,<br />
                NY 10092<br />
                <a className="hover:text-emerald-600" href="mailto:contact@Swootechmart.com">
                  contact@Swootechmart.com
                </a>
              </div>
              {/* Social Icons */}
              <div className="flex items-center space-x-2 pt-2">
                <a className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors" href="#twitter">
                  <i className="fa-brands fa-x-twitter text-sm" />
                </a>
                <a className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors" href="#facebook">
                  <i className="fa-brands fa-facebook-f text-sm" />
                </a>
                <a className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors" href="#instagram">
                  <i className="fa-brands fa-instagram text-sm" />
                </a>
                <a className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors" href="#youtube">
                  <i className="fa-brands fa-youtube text-sm" />
                </a>
                <a className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors" href="#share">
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Top Categories */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                TOP CATEGORIES
              </div>
              <ul className="text-xs text-slate-500 space-y-2">
                <li><Link className="hover:text-emerald-600" to="/products?category=laptop">Laptops</Link></li>
                <li><Link className="hover:text-emerald-600" to="/products?category=pc">PC & Computers</Link></li>
                <li><Link className="hover:text-emerald-600" to="/products?category=phone">Cell Phones</Link></li>
                <li><Link className="hover:text-emerald-600" to="/products?category=tablet">Tablets</Link></li>
                <li><Link className="hover:text-emerald-600" to="/products?category=gaming">Gaming & VR</Link></li>
                <li><Link className="hover:text-emerald-600" to="/products?category=network">Networks</Link></li>
                <li><Link className="hover:text-emerald-600" to="/products?category=camera">Cameras</Link></li>
                <li><Link className="hover:text-emerald-600" to="/products?category=headphone">Sounds</Link></li>
                <li><Link className="hover:text-emerald-600" to="/products?category=office">Office</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                COMPANY
              </div>
              <ul className="text-xs text-slate-500 space-y-2">
                <li><a className="hover:text-emerald-600" href="#about">About Swoo</a></li>
                <li><a className="hover:text-emerald-600" href="#contact">Contact</a></li>
                <li><a className="hover:text-emerald-600" href="#career">Career</a></li>
                <li><a className="hover:text-emerald-600" href="#blog">Blog</a></li>
                <li><a className="hover:text-emerald-600" href="#sitemap">Sitemap</a></li>
                <li><a className="hover:text-emerald-600" href="#stores">Store Locations</a></li>
              </ul>
            </div>

            {/* Help Center Links */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                HELP CENTER
              </div>
              <ul className="text-xs text-slate-500 space-y-2">
                <li><a className="hover:text-emerald-600" href="#service">Customer Service</a></li>
                <li><a className="hover:text-emerald-600" href="#policy">Policy</a></li>
                <li><a className="hover:text-emerald-600" href="#terms">Terms & Conditions</a></li>
                <li><Link className="hover:text-emerald-600" to="/account?tab=orders">Track Order</Link></li>
                <li><a className="hover:text-emerald-600" href="#faqs">FAQs</a></li>
                <li><Link className="hover:text-emerald-600" to="/account">My Account</Link></li>
                <li><a className="hover:text-emerald-600" href="#support">Product Support</a></li>
              </ul>
            </div>

            {/* Partner Links */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                PARTNER
              </div>
              <ul className="text-xs text-slate-500 space-y-2">
                <li><a className="hover:text-emerald-600" href="#become-seller">Become Seller</a></li>
                <li><a className="hover:text-emerald-600" href="#affiliate">Affiliate</a></li>
                <li><a className="hover:text-emerald-600" href="#advertise">Advertise</a></li>
                <li><a className="hover:text-emerald-600" href="#partnership">Partnership</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Bar & Currency Selection */}
          <div className="border-t border-b border-slate-100 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex items-center space-x-3">
              <div className="border border-slate-200 rounded-xl px-3.5 py-2 flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer hover:border-emerald-500 bg-white">
                <span>USD</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="border border-slate-200 rounded-xl px-3.5 py-2 flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer hover:border-emerald-500 bg-white">
                <span className="w-4 h-3 bg-red-600 rounded-xs inline-flex overflow-hidden relative shadow-xs">
                  <span className="absolute inset-x-0 top-1/3 bottom-1/3 bg-white" />
                  <span className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-700" />
                </span>
                <span>Eng</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                SUBSCRIBE & GET <span className="text-red-500">10% OFF</span> FOR YOUR FIRST ORDER
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    showToast("Đăng ký thành công!", `Mã giảm giá 10% đã được gửi tới: ${newsletterEmail}`);
                    setNewsletterEmail("");
                  }
                }}
                className="mt-3 flex items-center border-b-2 border-slate-200 focus-within:border-emerald-600 transition-colors pb-1"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full border-0 bg-transparent px-0 py-2 text-xs text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none"
                  placeholder="Enter your email address"
                />
                <button
                  type="submit"
                  className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 tracking-wider uppercase px-2 py-2 cursor-pointer"
                >
                  SUBSCRIBE
                </button>
              </form>
              <div className="text-[11px] text-slate-400 mt-1.5">
                By subscribing, you've accepted our <a className="underline hover:text-slate-600" href="#policy">Policy</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Payment Providers */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              © 2024 <strong className="text-slate-700">SWOO Tech Mart Inc</strong>. All Rights Reserved
            </div>
            <div className="flex items-center space-x-4 opacity-80">
              <span className="font-black text-blue-800 text-sm tracking-tighter italic">PayPal</span>
              <span className="font-extrabold text-red-600 text-sm tracking-tight">Mastercard</span>
              <span className="font-black text-blue-600 text-sm tracking-tight italic">VISA</span>
              <span className="font-extrabold text-indigo-500 text-sm tracking-tight">stripe</span>
              <span className="font-black text-pink-500 text-sm tracking-tight">Klarna.</span>
            </div>
            <div>
              <Link className="text-blue-600 hover:underline font-semibold" to="/products">
                All Products
              </Link>
            </div>
          </div>
        </div>
      </footer>
      {/* END: SiteFooter */}
    </div>
  );
}
