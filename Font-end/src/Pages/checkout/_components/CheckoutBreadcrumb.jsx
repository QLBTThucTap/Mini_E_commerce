import { Link } from "react-router-dom";

export default function CheckoutBreadcrumb() {
  return (
    <div className="w-full bg-[#eff4ff] py-3 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1360px] mx-auto px-4 flex items-center gap-2 text-xs font-semibold text-[#565e74]">
        <Link
          to="/"
          className="hover:text-[#006948] transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          <span>Home</span>
        </Link>
        <span className="material-symbols-outlined text-[14px] text-slate-400">
          chevron_right
        </span>
        <Link to="/cart" className="hover:text-[#006948] transition-colors">
          Shop Cart
        </Link>
        <span className="material-symbols-outlined text-[14px] text-slate-400">
          chevron_right
        </span>
        <span className="text-[#0b1c30] font-bold">Checkout</span>
      </div>
    </div>
  );
}
