import { useState } from "react";
import useAuthStore from "../Stores/authStore";
import useCartStore from "../Stores/cartStore";
import useWishlistStore from "../Stores/wishlistStore";
import TopBar from "./TopBar";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ onSearch }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("all");

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(e);
      return;
    }
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("q", searchInput.trim());
    if (categoryInput !== "all") params.set("category", categoryInput);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      {/* Top Micro Bar */}
      <TopBar />

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Top row on mobile: Logo + Actions */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="./src/assets/brand.ico" className="w-20 h-20"></img>
            <div>
              <div className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                Lã Ngọc Huyền
              </div>
              <span className="text-[10px] tracking-widest font-semibold text-slate-500 uppercase">
                TECH MART
              </span>
            </div>
          </Link>

          {/* Quick Cart on Mobile */}
          <div className="flex items-center space-x-3 md:hidden">
            <Link
              to="/wishlist"
              className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              <i
                className={`text-sm ${
                  wishlistCount > 0
                    ? "fa-solid fa-heart text-rose-500"
                    : "fa-regular fa-heart"
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow"
            >
              <i className="fa-solid fa-bag-shopping text-sm" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 sm:space-x-7 text-xs font-bold tracking-wide uppercase text-slate-800 overflow-x-auto max-w-full py-1">
          <Link
            to="/"
            className="flex items-center space-x-1 cursor-pointer hover:text-emerald-600 transition shrink-0"
          >
            <span>HOMES</span>
            <i className="fa-solid fa-chevron-down text-[9px]" />
          </Link>
          <Link
            to="/cart"
            className="flex items-center space-x-1 cursor-pointer hover:text-emerald-600 transition shrink-0"
          >
            <span>PAGES</span>
            <i className="fa-solid fa-chevron-down text-[9px]" />
          </Link>
          <Link
            to="/products"
            className="flex items-center space-x-1 cursor-pointer hover:text-emerald-600 transition shrink-0"
          >
            <span>PRODUCTS</span>
            <i className="fa-solid fa-chevron-down text-[9px]" />
          </Link>
          <Link
            to="/contact"
            className="hover:text-emerald-600 transition shrink-0"
          >
            CONTACT
          </Link>
        </nav>

        {/* User Actions & Cart (Desktop & Tablet) */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Quick Actions */}
          <div className="flex items-center space-x-3 text-slate-600">
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
              title="Notifications"
            >
              <i className="fa-regular fa-bell text-sm" />
            </button>
            <Link
              to="/wishlist"
              className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-600 cursor-pointer"
              title="Wishlist"
            >
              <i
                className={`text-sm ${
                  wishlistCount > 0
                    ? "fa-solid fa-heart text-rose-500"
                    : "fa-regular fa-heart"
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          {/* Account Greeting */}
          {user ? (
            <div className="text-left leading-tight flex items-center gap-2">
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/account"}
                className="cursor-pointer group"
              >
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  WELCOME BACK
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {user.fullName ||
                    (typeof user.name === "string"
                      ? user.name
                      : typeof user.name === "object"
                        ? `${user.name?.firstname || ""} ${user.name?.lastname || ""}`.trim()
                        : user.username || "Account")}
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition cursor-pointer ml-1"
                title="Logout"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
              </button>
            </div>
          ) : (
            <div className="text-left leading-tight">
              <div className="text-[10px] uppercase font-semibold text-slate-400">
                WELCOME
              </div>
              <Link
                to="/login"
                className="text-xs font-bold text-slate-900 cursor-pointer hover:text-emerald-600 transition"
              >
                LOG IN / REGISTER
              </Link>
            </div>
          )}

          {/* Cart Box */}
          <Link
            to="/cart"
            className="flex items-center space-x-2.5 pl-3 border-l border-slate-200 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow group-hover:bg-emerald-700 transition">
              <i className="fa-solid fa-bag-shopping text-sm" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="leading-tight">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                CART
              </span>
              <span className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Green Sub-Bar with Search and Guarantees */}
      <div className="bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category & Search Box */}
          <form
            onSubmit={handleSubmitSearch}
            className="w-full md:w-5/12 bg-white rounded-md flex items-center overflow-hidden p-0.5 border border-white"
          >
            <div className="relative px-3 py-1.5 flex items-center space-x-2 text-xs font-bold text-slate-800 border-r border-slate-200 cursor-pointer bg-slate-50 shrink-0">
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="appearance-none bg-transparent pr-5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer border-none"
              >
                <option value="all">All Categories</option>
                <option value="laptop">Laptop</option>
                <option value="phone">Smartphones</option>
                <option value="headphone">Audio & Visual</option>
                <option value="keyboard">Gaming Gear</option>
              </select>
              <i className="fa-solid fa-chevron-down text-[9px] text-slate-500 absolute right-2 pointer-events-none" />
            </div>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search anything..."
              className="w-full text-xs text-slate-800 px-3 py-1.5 focus:outline-none border-none focus:ring-0"
            />

            <button
              type="submit"
              className="px-4 text-emerald-600 font-bold hover:text-emerald-700 transition cursor-pointer shrink-0"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </form>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-xs font-bold tracking-wider uppercase">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-truck-fast text-sm" />
              <span>FREE SHIPPING OVER $199</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-rotate-left text-sm" />
              <span>30 DAYS MONEY BACK</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-shield-halved text-sm" />
              <span>100% SECURE PAYMENT</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
