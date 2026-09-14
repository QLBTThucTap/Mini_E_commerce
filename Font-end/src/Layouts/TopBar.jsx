export default function TopBar({ hotline = "(025) 3886 25 16" }) {
  return (
    <div className="border-b border-slate-100 text-xs text-slate-500 py-1.5 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-slate-400">Hotline 24/7</span>
          <a
            href="tel:02538862516"
            className="font-bold text-slate-800 hover:text-emerald-600 transition"
          >
            {hotline}
          </a>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6 text-[11px] sm:text-xs">
          <a className="hover:text-emerald-600 transition" href="#sell">
            Sell on Swoo
          </a>
          <a className="hover:text-emerald-600 transition" href="#track">
            Order Tracki
          </a>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-slate-800">
            <span>USD</span>
            <i className="fa-solid fa-chevron-down text-[10px]" />
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-slate-800">
            <img
              alt="US Flag"
              className="w-3.5 h-2.5 rounded-xs inline-block"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNQO_6CHPZObfWOGjmy17iyG-bzsKSHC4s9XIhLx4A0aqPriDT3GR6jrbGUtpoYN_Lioxtv-pom-ys2-Ra9_ErLvp4beiEgDHdZQGBLT3302Y5HiOt6GRanSx-p_zWYSOvZFCg024tcyxnD22uU-hBE93ibf7Ikygluq6Yv4qebHhnAwSegsxDQIUwZN7c28_p3MQ1oJDGsIjEOkVFLufceQ6I5IhvDGu17qutqq8U3uZ2mb2PFgNA"
            />
            <span>Eng</span>
            <i className="fa-solid fa-chevron-down text-[10px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
