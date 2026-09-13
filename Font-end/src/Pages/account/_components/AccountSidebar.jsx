import { Link } from "react-router-dom";
import { TABS } from "../_utils/accountConstants";

export default function AccountSidebar({ activeTab, setActiveTab }) {
  return (
    <nav className="space-y-2 w-full">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              isActive
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 border border-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <i className={`${tab.icon} text-sm ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </div>
            <i
              className={`fa-solid fa-arrow-right text-xs ${
                isActive ? "text-white" : "text-slate-400"
              }`}
            />
          </button>
        );
      })}

      <div className="pt-2">
        <Link
          to="/"
          className="w-full flex items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
          Về trang chủ
        </Link>
      </div>
    </nav>
  );
}