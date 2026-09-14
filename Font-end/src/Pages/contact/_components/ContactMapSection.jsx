export default function ContactMapSection() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 lg:p-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-map-location-dot text-emerald-600 text-base" />
            <span>FIND US ON GOOGLE MAP</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ghé thăm trung tâm trải nghiệm công nghệ và bảo hành chính hãng của chúng tôi
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Mở cửa tất cả các ngày</span>
        </div>
      </div>

      {/* Styled Map Canvas Area */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-200">
        <iframe
          className="w-full h-full border-0 grayscale-[20%] contrast-[1.05]"
          loading="lazy"
          src="https://maps.google.com/maps?q=Piazza%20San%20Francesco,%20Lucca&t=&z=15&ie=UTF8&iwloc=&output=embed"
          title="Google Map Tech Mart Location"
        />

        {/* Map Floating Card Badge - Responsive on mobile and desktop */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-xl shadow-md border border-slate-200/90 sm:max-w-xs text-xs z-10 transition-all">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 truncate">
                Lã Ngọc Huyền Tech Mart
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                257 Thatcher Road St, Manhattan, NY 10092
              </p>
              <div className="flex items-center space-x-1.5 mt-1.5">
                <span className="font-bold text-amber-500 text-[11px]">4.9</span>
                <div className="flex text-amber-400 text-[10px]">
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star-half-stroke" />
                </div>
                <span className="text-[10px] text-emerald-600 font-medium cursor-pointer hover:underline">
                  (944 đánh giá)
                </span>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Manhattan,NY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 flex flex-col items-center shrink-0 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
              title="Chỉ đường"
            >
              <i className="fa-solid fa-diamond-turn-right text-sm" />
              <span className="text-[9px] font-bold mt-0.5">Chỉ đường</span>
            </a>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Giờ hoạt động: 08:00 - 21:00</span>
            <a
              href="https://maps.google.com/?q=Manhattan,NY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline font-semibold"
            >
              Xem bản đồ lớn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
