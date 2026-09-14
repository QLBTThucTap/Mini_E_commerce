import Card from "../../../Components/ui/Card";

export default function AboutHero() {
  return (
    <Card padding="p-6 sm:p-10 lg:p-12" className="shadow-sm relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Heading & Introduction */}
        <div className="lg:col-span-6 z-10 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Modern Technical Commerce
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight my-0">
            Best experience <br className="hidden sm:inline" />
            <span className="text-emerald-600">always wins</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            Sàn thương mại điện tử chuyên cung cấp thiết bị công nghệ & điện tử chính hãng hàng đầu.
            Chúng tôi kiến tạo trải nghiệm mua sắm minh bạch, dịch vụ tin cậy và đồng hành cùng khách hàng trên từng thiết bị số.
          </p>

          {/* Quick Highlight Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-check text-xs" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">100% Chính Hãng</span>
                <span className="text-[11px] text-slate-400">CO/CQ rõ ràng</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-shield-check text-xs" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">Bảo Hành Uy Tín</span>
                <span className="text-[11px] text-slate-400">Hỗ trợ kỹ thuật 24/7</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-bolt text-xs" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">Giao Toàn Quốc</span>
                <span className="text-[11px] text-slate-400">Đóng gói chuẩn công nghệ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-100 aspect-[16/10] group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPSwOl0cJi5A2yn_dlIPmiBf55IvFTIFAg_Z6za3p_kkF0s7bezRrcu5H-Ef6KOXGOyiMGVeBZcCoKoZaE1Y7JDiODyMKoxMBqEE6Eas9bN2_XBQD3uQL7ej4w7FhM6DbUccpVZvFSpCzBJ6EVnFxyZygdIgb2pGkiO5HC-Q7D8PoY3-7hd4MjLasjRlP9_LPaiPDQyam0fe3H-v0hVUe94sfAmCv2FiGOB2nJGdmb3xcjzkdh81Ql"
              alt="Tech Mart Packaging Showcase"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
            
            {/* Overlay Chip */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2 flex items-center gap-2.5 shadow-md border border-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
                #1 Tech Platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
