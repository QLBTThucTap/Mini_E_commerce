export default function LoginIllustration() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-6 sm:py-8 select-none">
      {/* Visual Composition Container */}
      <div className="relative w-full max-w-[340px] px-4">
        {/* Dollar Badge Top Left */}
        <div className="absolute -top-2 left-2 z-20 w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg transform -rotate-6 border-2 border-white">
          $
        </div>

        {/* Rating Card Top Right */}
        <div className="absolute -top-4 right-0 z-20 bg-white rounded-2xl px-3.5 py-2 shadow-lg border border-slate-100 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xs font-bold shrink-0">
            ★
          </div>
          <div className="leading-tight">
            <span className="block text-xs font-extrabold text-slate-900">
              4.9 / 5.0 Rating
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              12k+ NYC Tech Shoppers
            </span>
          </div>
        </div>

        {/* Central Device/Vault Mockup */}
        <div className="w-[240px] sm:w-[260px] mx-auto bg-white rounded-3xl border-4 border-slate-900 shadow-xl overflow-hidden pt-3 pb-6 px-4 relative mt-5">
          {/* Top Notch & Camera */}
          <div className="w-16 h-3 bg-slate-900 rounded-full mx-auto mb-4" />

          {/* Device Top Icons */}
          <div className="flex justify-between items-center text-xs text-slate-300 px-1 mb-4">
            <i className="fa-solid fa-gear text-blue-500" />
            <i className="fa-solid fa-star text-amber-400" />
          </div>

          {/* Shield Badge Container */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl mx-auto shadow-md">
            <i className="fa-solid fa-shield-halved" />
          </div>

          {/* Protected Vault Pill */}
          <div className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold w-full">
            <i className="fa-solid fa-lock text-[10px] text-emerald-600" />
            <span>Protected Vault</span>
          </div>

          {/* Placeholder Lines */}
          <div className="space-y-1.5 my-4 px-2">
            <div className="h-1.5 bg-slate-100 rounded-full w-full" />
            <div className="h-1.5 bg-slate-100 rounded-full w-3/4 mx-auto" />
          </div>

          {/* Fast & Safe Checkout Pill */}
          <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 py-1.5 rounded-xl border border-emerald-100">
            <i className="fa-solid fa-check text-[10px]" />
            <span>Fast & Safe Checkout</span>
          </div>
        </div>

        {/* SWOO PAY Floating Credit Card */}
        <div className="relative -mt-16 -ml-2 sm:-ml-6 z-30 w-52 sm:w-56 bg-gradient-to-tr from-emerald-600 via-emerald-600 to-teal-500 text-white rounded-2xl p-4 shadow-xl border border-emerald-400/40 transform -rotate-3 hover:rotate-0 transition-transform">
          <div className="flex justify-between items-start mb-3">
            <i className="fa-solid fa-microchip text-amber-300 text-lg" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              SWOO PAY
            </span>
          </div>
          <div className="font-mono text-xs tracking-widest font-bold my-1 text-emerald-50">
            XXXX •••• 8842
          </div>
          <div className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-200 mt-2">
            VERIFIED MEMBER
          </div>
        </div>
      </div>

      {/* Description Below Mockup */}
      <div className="mt-8 text-center px-4 max-w-xs">
        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
          100% Guaranteed Tech Shopping
        </h4>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Access member discounts, expedited shipping, and personalized tech support.
        </p>
      </div>
    </div>
  );
}
