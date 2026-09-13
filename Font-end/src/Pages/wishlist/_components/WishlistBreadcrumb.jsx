import { Link } from "react-router-dom";

export default function WishlistBreadcrumb({ count = 0 }) {
  return (
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
          <span className="text-slate-900 font-bold">Danh sách yêu thích</span>
        </div>
        <span className="text-slate-500 hidden sm:inline">
          Tổng cộng: <strong className="text-slate-800">{count}</strong> sản phẩm
        </span>
      </div>
    </div>
  );
}
