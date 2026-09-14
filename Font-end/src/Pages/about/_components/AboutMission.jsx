export default function AboutMission() {
  return (
    <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 lg:p-12 relative overflow-hidden border border-slate-800 shadow-xl space-y-8">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Our Mission & Vision
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white my-0">
          Sứ Mệnh Phổ Cập Công Nghệ Đỉnh Cao & Minh Bạch
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Chúng tôi tin rằng công nghệ tiên tiến phải gắn liền với sự minh bạch và trách nhiệm dịch vụ. Mục tiêu của chúng tôi là trở thành điểm tựa công nghệ đáng tin cậy nhất cho từng cá nhân và doanh nghiệp.
        </p>
      </div>

      {/* 3 Mission Pillars */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-5 hover:border-emerald-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base mb-3.5">
            <i className="fa-solid fa-microchip" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Tuyển Chọn Khắt Khe
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            Mỗi thiết bị đều được kiểm tra hiệu năng, chứng nhận nguồn gốc xuất xứ chính hãng và đáp ứng các tiêu chuẩn kỹ thuật nghiêm ngặt.
          </p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-5 hover:border-emerald-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base mb-3.5">
            <i className="fa-solid fa-scale-balanced" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Giá Cả Minh Bạch
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            Không chi phí ẩn. Mọi mức giá niêm yết, chính sách thuế VAT và khuyến mãi đều rõ ràng, bảo đảm quyền lợi tối đa cho người mua.
          </p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-5 hover:border-emerald-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base mb-3.5">
            <i className="fa-solid fa-user-shield" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Hậu Mãi Tận Tâm
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            Chính sách bảo hành 1 đổi 1 nhanh chóng, hỗ trợ kỹ thuật trọn đời và đội ngũ chuyên gia công nghệ đồng hành 24/7.
          </p>
        </div>
      </div>

      {/* Modern Headquarters Banner with Overlay */}
      <div className="relative z-10 rounded-2xl overflow-hidden h-[240px] sm:h-[320px] shadow-lg border border-slate-700/50 group">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY7keFtt8NHDmInhfWo15q4oAj_p7NHoRNQK4VgD3fyLieGXii8ShjONcuxPZUHSQk_0xXc-7TCipwAcNGHQ5cRW-fLLKWxar-sV96kugLn6lBuJ0WpuSlm1PhKRlGqFaXEvSnnDSZ6rnZEHD4KtFvoNvME_zZG6Yl7oGZ1XbCXUJFFhwhlbvOQS6EwtpOUzOK5Nst1L1cvLvkskW3e8Wq5TpqyhsRl813Cmg8WkohuVRgQGCZ_zCU"
          alt="Tech City View and Headquarters"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6">
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-extrabold tracking-widest block">
                GLOBAL LOGISTICS & INNOVATION CENTER
              </span>
              <span className="text-sm sm:text-base font-bold text-white">
                Trụ sở nghiên cứu & trung tâm phân phối công nghệ cao
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
