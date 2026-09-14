export default function RegisterIllustration() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-6 sm:py-8 select-none">
      {/* Central Illustration Artboard */}
      <div className="relative w-full max-w-[340px] px-4">
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute top-10 left-4 w-12 h-12 rounded-full bg-amber-100/80 -z-10" />
        <div className="absolute top-8 right-2 w-10 h-10 rounded-full bg-sky-100/80 -z-10" />

        {/* Dollar Badge */}
        <div className="absolute top-14 left-6 z-20 w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md">
          $
        </div>

        {/* Lock Pill Badge Top Left */}
        <div className="absolute top-6 left-16 z-20 w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md text-xs">
          <i className="fa-solid fa-lock" />
        </div>

        {/* Rating Stars Badge Top Right */}
        <div className="absolute top-16 right-6 z-20 bg-amber-400 text-white px-2 py-0.5 rounded-lg shadow-md text-[10px] font-bold flex items-center gap-0.5">
          <span>★★★</span>
        </div>

        {/* Central Smartphone Mockup */}
        <div className="w-[220px] sm:w-[240px] mx-auto bg-white rounded-3xl border-4 border-slate-900 shadow-xl overflow-hidden pt-3 pb-8 px-4 relative mt-4 min-h-[300px] flex flex-col items-center justify-center">
          {/* Top Notch */}
          <div className="w-14 h-2.5 bg-slate-900 rounded-full mx-auto absolute top-3" />

          {/* Big Security Shield in Phone */}
          <div className="w-20 h-24 rounded-2xl border-2 border-sky-400 bg-sky-50/50 flex items-center justify-center relative mt-6">
            <div className="w-14 h-16 rounded-xl border-2 border-sky-500 flex items-center justify-center text-sky-500 text-2xl font-bold">
              ✓
            </div>
          </div>

          {/* Tiny decorative user avatars on left & right */}
          <div className="absolute bottom-8 left-2 flex items-center gap-1">
            <div className="w-5 h-8 bg-amber-400 rounded-t-lg" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 -mt-7 -ml-4" />
          </div>

          <div className="absolute bottom-8 right-3 flex items-center gap-1">
            <div className="w-5 h-10 bg-emerald-500 rounded-t-lg" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 -mt-9 -ml-4" />
          </div>

          {/* Tiny Plant */}
          <div className="absolute bottom-2 right-10 text-emerald-600 text-xs">
            <i className="fa-solid fa-seedling" />
          </div>
        </div>

        {/* Overlapping Blue Credit Card */}
        <div className="relative -mt-16 -ml-3 sm:-ml-5 z-30 w-48 sm:w-52 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-xl p-3 shadow-lg border border-sky-300/40 transform -rotate-2">
          <div className="flex justify-between items-center mb-2">
            <div className="w-6 h-4 rounded bg-white/20" />
            <span className="text-[9px] font-bold">DEBIT</span>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-sky-100 font-bold">
            XXXX - XXXX - 4829
          </div>
        </div>
      </div>

      {/* 3 Feature Bullet Points below */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600 px-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Encrypted Credentials</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Fast 1-Click Checkout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Exclusive Member Deals</span>
        </div>
      </div>
    </div>
  );
}
