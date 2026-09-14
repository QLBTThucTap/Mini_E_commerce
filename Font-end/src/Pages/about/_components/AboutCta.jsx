import { useNavigate } from "react-router-dom";
import Button from "../../../Components/ui/Button";

export default function AboutCta() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Main Dark Slate + Emerald CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1c30] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Ready To Upgrade Your Gear?
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight my-0">
            Sẵn sàng khám phá hệ sinh thái sản phẩm công nghệ của chúng tôi?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hàng ngàn sản phẩm máy tính, laptop, điện thoại và phụ kiện chính
            hãng đang chờ đón bạn với chính sách giá minh bạch, giao hỏa tốc và
            bảo hành chu đáo.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              icon="fa-solid fa-bag-shopping"
              iconPosition="left"
              onClick={() => navigate("/products")}
            >
              Shop Now / Khám Phá Ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Member Benefit Sub-banner (recreated as in reference with modern touch) */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 py-3.5 px-6 sm:px-8 text-white flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
            <i className="fa-solid fa-star text-amber-300" />
          </div>
          <p className="text-xs font-medium tracking-wide">
            Thành viên nhận{" "}
            <strong className="font-extrabold underline">
              MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC
            </strong>{" "}
            không giới hạn đơn hàng tối thiểu!
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-xs font-bold underline hover:text-amber-200 transition-colors ml-0 sm:ml-2"
        >
          Đăng ký trải nghiệm ngay
        </button>
      </div>
    </div>
  );
}
