export default function ContactInfoCard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Information Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-7 space-y-6">
        {/* Head Office */}
        <div className="space-y-3 pb-5 border-b border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
              Headquarters (Trụ sở chính)
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 text-slate-700">
              <i className="fa-solid fa-location-dot text-emerald-600 mt-0.5 text-sm shrink-0 w-4 text-center" />
              <span className="font-medium leading-relaxed">
                257 Thatcher Road St, Manhattan, NY 10092, US
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <i className="fa-solid fa-phone-volume text-emerald-600 text-sm shrink-0 w-4 text-center" />
              <a
                href="tel:02538862516"
                className="font-bold text-slate-900 hover:text-emerald-600 transition-colors"
              >
                (025) 3886 25 16 / 0824 781 531
              </a>
            </div>

            <div className="flex items-center gap-3">
              <i className="fa-solid fa-envelope text-emerald-600 text-sm shrink-0 w-4 text-center" />
              <a
                href="mailto:contact@swootechmart.com"
                className="font-medium text-emerald-600 hover:underline break-all"
              >
                contact@swootechmart.com
              </a>
            </div>
          </div>
        </div>

        {/* Branch / Showroom */}
        <div className="space-y-3 pb-5 border-b border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
              Showroom & Service Center
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 text-slate-700">
              <i className="fa-solid fa-building text-blue-600 mt-0.5 text-sm shrink-0 w-4 text-center" />
              <span className="font-medium leading-relaxed">
                12 Buckingham Rd, Thornthwaite, HG3 4TY, UK
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <i className="fa-solid fa-phone text-blue-600 text-sm shrink-0 w-4 text-center" />
              <a
                href="tel:7188955350"
                className="font-bold text-slate-900 hover:text-emerald-600 transition-colors"
              >
                (+718) 895-5350
              </a>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-amber-500 text-xs shrink-0 w-4 text-center" />
            <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
              Working Hours (Giờ làm việc)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pl-0 sm:pl-6">
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-2.5">
              <span className="block font-semibold text-slate-800">Thứ 2 - Thứ 7:</span>
              <span className="text-slate-500">08:00 AM - 09:00 PM</span>
            </div>
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-2.5">
              <span className="block font-semibold text-slate-800">Chủ Nhật:</span>
              <span className="text-slate-500">09:00 AM - 06:00 PM</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-2 border-t border-slate-200/70">
          <div className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase mb-3">
            Connect With Us
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#twitter"
              aria-label="Twitter"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 flex items-center justify-center text-xs transition-all shadow-xs"
            >
              <i className="fa-brands fa-x-twitter" />
            </a>
            <a
              href="#facebook"
              aria-label="Facebook"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 flex items-center justify-center text-xs transition-all shadow-xs"
            >
              <i className="fa-brands fa-facebook-f" />
            </a>
            <a
              href="#instagram"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 flex items-center justify-center text-xs transition-all shadow-xs"
            >
              <i className="fa-brands fa-instagram" />
            </a>
            <a
              href="#youtube"
              aria-label="YouTube"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 flex items-center justify-center text-xs transition-all shadow-xs"
            >
              <i className="fa-brands fa-youtube" />
            </a>
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 flex items-center justify-center text-xs transition-all shadow-xs"
            >
              <i className="fa-brands fa-linkedin-in" />
            </a>
          </div>
        </div>
      </div>

      {/* Modern Tech Workspace Photo */}
      <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs group">
        <img
          alt="Modern Tech Mart Workspace"
          className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-500"
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex flex-col justify-end p-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold tracking-wide uppercase w-fit mb-1.5 backdrop-blur-xs">
            <i className="fa-solid fa-check text-[9px]" />
            Official Tech Hub
          </div>
          <p className="text-white text-xs font-semibold">
            Trải nghiệm các sản phẩm công nghệ mới nhất tại showroom của chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
}
