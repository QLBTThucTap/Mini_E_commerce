import { Link } from "react-router-dom";

export default function AboutBreadcrumb() {
  return (
    <div className="w-full bg-slate-100/70 border-b border-slate-200/80 py-3">
      <div className="max-w-[1360px] mx-auto px-4 flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
        <Link
          to="/"
          className="hover:text-emerald-600 transition-colors flex items-center gap-1.5"
        >
          <i className="fa-solid fa-house text-[11px]" />
          <span>Home</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">Pages</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-bold">About Us</span>
      </div>
    </div>
  );
}
