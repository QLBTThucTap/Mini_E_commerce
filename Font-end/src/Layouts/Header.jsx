import { useState } from "react";
import useAuthStore from "../Stores/authStore";
import useCartStore from "../Stores/cartStore";
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <TopBar />

      <div className="max-w-[1360px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                LH
              </div>
              <div>
                <div className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Lã Ngọc Huyền
                </div>
                <div className="text-[10px] tracking-widest font-bold text-emerald-600 uppercase mt-0.5">
                  TECH MART
                </div>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-slate-700">
              <Link to="/" className="hover:text-emerald-600 transition-colors">
                HOMES
              </Link>
              <Link to="/products" className="hover:text-emerald-600 transition-colors">
                PRODUCTS
              </Link>
              <Link to="/cart" className="hover:text-emerald-600 transition-colors">
                PAGES
              </Link>
              <a
                href="#contact"
                className="hover:text-emerald-600 transition-colors"
              >
                CONTACT
              </a>
            </nav>
          </div>

          <div className="flex-1 max-w-2xl">
            <form
              onSubmit={handleSubmitSearch}
              className="flex items-center rounded-xl border-2 border-emerald-600/90 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/30 transition-all"
            >
              <div className="relative flex items-center border-r border-slate-200 px-3.5 py-2.5 bg-slate-50/50">
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="appearance-none bg-transparent pr-7 pl-1 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer border-0"
                >
                  <option value="all">All Categories</option>
                  <option value="laptop">Laptops</option>
                  <option value="phone">Smartphones</option>
                  <option value="headphone">Audio & Visual</option>
                  <option value="keyboard">Gaming Gear</option>
                </select>
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 absolute right-3 pointer-events-none" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, brands, model numbers..."
                className="w-full border-0 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-magnifying-glass text-sm" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-700 hover:text-emerald-600 transition-colors rounded-full hover:bg-slate-100">
              <i className="fa-regular fa-heart text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600" />
            </button>

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/account"}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <i className="fa-regular fa-user text-base" />
                  </div>
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <div className="text-slate-400 font-medium">
                      WELCOME BACK
                    </div>
                    <div className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {user.fullName ||
                        (typeof user.name === "string"
                          ? user.name
                          : typeof user.name === "object"
                            ? `${user.name?.firstname || ""} ${user.name?.lastname || ""}`.trim()
                            : user.username || "Tài khoản")}
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden lg:block text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  ĐĂNG XUẤT
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <i className="fa-regular fa-user text-base" />
                  </div>
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <div className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      Login
                    </div>
                  </div>
                </Link>

                <Link
                  to="/register"
                  className="hidden lg:block text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              className="flex items-center gap-3 pl-2 cursor-pointer group"
            >
              <div className="relative w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <i className="fa-solid fa-bag-shopping text-base" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white group-hover:bg-slate-900">
                    {cartCount}
                  </span>
                )}
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

      <div className="bg-emerald-600 text-white text-xs font-semibold py-2">
        <div className="max-w-[1360px] mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-truck text-emerald-200" />
            <span>FREE SHIPPING OVER $199</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-rotate-left text-emerald-200" />
            <span>30 DAYS MONEY BACK GUARANTEE</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-emerald-200" />
            <span>100% SECURE CHECKOUT</span>
          </div>
        </div>
      </div>
    </header>
  );
}
