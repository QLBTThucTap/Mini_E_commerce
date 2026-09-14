import { useNavigate } from "react-router-dom";
import Card from "../../../Components/ui/Card";
import Button from "../../../Components/ui/Button";

export default function AboutWhoWeAre() {
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Visual Box with Floating Badge */}
      <div className="lg:col-span-5 rounded-2xl overflow-hidden relative shadow-sm border border-emerald-500/20 bg-slate-900 min-h-[360px] sm:min-h-[420px] flex items-center justify-center group">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1m7T9pH-Arw-vNchUCvxEcfDVVbmCVFMkhd2cSMGrFcx-4WmjTFDT6PRWUCihSuB2lis9jMrBzg8RoTgfEFtqJW16PrynbhCTY6yB_briGEQlU65oVRt6UE2BKA_BSrP_niHOwTj_jdvuwDQn4HTwoA5IeJOwn2GiL8TOYW555APlAyWiicrQRXux--qiZBEUvD87g9WHATN8yROBpWZ63kYd38i7OjewR-NhC1jBHEpfRoVoEQlF"
          alt="SWOO Express Courier Delivery"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Floating Label Overlay */}
        <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 flex items-center space-x-3.5 shadow-xl border border-white">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            <i className="fa-solid fa-shield-check" />
          </div>
          <div>
            <span className="block text-xs font-black text-slate-900 uppercase leading-none">
              SWOO TECH EXPRESS
            </span>
            <span className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase leading-none mt-1 block">
              100% AUTHORIZED LOGISTICS
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Text Card */}
      <Card
        padding="p-8 sm:p-10 lg:p-12"
        className="lg:col-span-7 flex flex-col justify-center shadow-sm"
      >
        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Who We Are / Chúng Tôi Là Ai
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug my-0">
          Kết nối hàng triệu tín đồ công nghệ với sản phẩm chất lượng cao, minh bạch và dịch vụ tin cậy.
        </h2>

        <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed">
          Được xây dựng với niềm đam mê công nghệ vượt bậc, chúng tôi tập trung phân phối các thiết bị điện tử, laptop, linh kiện PC và phụ kiện âm thanh hàng đầu. Mỗi sản phẩm có mặt trên sàn đều được tuyển lựa kỹ lưỡng với đầy đủ nguồn gốc xuất xứ, chế độ bảo hành rõ ràng cùng trải nghiệm mua hàng tinh gọn.
        </p>

        <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
          Chúng tôi không chỉ bán sản phẩm; chúng tôi cung cấp giải pháp công nghệ toàn diện giúp bạn nâng cấp không gian làm việc, tăng năng suất cá nhân và khám phá tiềm năng số hóa của thời đại mới.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="md"
            icon="fa-solid fa-arrow-right"
            onClick={() => navigate("/products")}
          >
            Khám Phá Sản Phẩm
          </Button>
          <Button
            variant="outline"
            size="md"
            icon="fa-solid fa-envelope"
            iconPosition="left"
            onClick={() => navigate("/contact")}
          >
            Liên Hệ Tư Vấn
          </Button>
        </div>
      </Card>
    </section>
  );
}
