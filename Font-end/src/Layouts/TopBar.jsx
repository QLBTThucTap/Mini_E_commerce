import SelectorPill from "../Components/common/SelectorPill";

export default function TopBar({ hotline = "(025) 3686 25 16" }) {
  return (
    <div className="border-b border-slate-200/80 bg-white text-xs text-slate-500">
      <div className="max-w-[1360px] mx-auto px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Hotline 24/7</span>
          <span className="font-bold text-slate-800 hover:text-emerald-600 cursor-pointer transition-colors">
            {hotline}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#sell" className="hover:text-emerald-600 transition-colors">
            Sell on Swoo
          </a>
          <span className="text-slate-300">|</span>
          <a href="#track" className="hover:text-emerald-600 transition-colors">
            Order Tracking
          </a>
          <span className="text-slate-300">|</span>
          <SelectorPill
            label="USD"
            className="border-0 px-0 py-0 hover:border-0"
          />
          <SelectorPill
            label="Eng"
            className="border-0 px-0 py-0 hover:border-0"
          />
        </div>
      </div>
    </div>
  );
}
