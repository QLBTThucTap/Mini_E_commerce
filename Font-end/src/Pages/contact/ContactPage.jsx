import { useState } from "react";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import Card from "../../Components/ui/Card";
import { FOOTER_BRAND, FOOTER_COLUMNS } from "../home/_constants/footer";

import ContactBreadcrumb from "./_components/ContactBreadcrumb";
import ContactForm from "./_components/ContactForm";
import ContactInfoCard from "./_components/ContactInfoCard";
import ContactMapSection from "./_components/ContactMapSection";

export default function ContactPage() {
  const [toastMessage, setToastMessage] = useState(null);

  const handleFormSuccess = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#0b1c30] text-white px-5 py-3.5 rounded-2xl shadow-xl text-xs flex items-start gap-3 border border-slate-700 animate-in fade-in duration-300">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            ✓
          </span>
          <div className="flex-1 leading-relaxed">{toastMessage}</div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <ContactBreadcrumb />

      {/* Main Content */}
      <main className="max-w-[1360px] mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1 w-full">
        {/* Contact Hero Introduction Card */}
        <Card padding="p-4 sm:p-8 lg:p-10" className="shadow-sm">
          {/* Header Banner */}
          <div className="mb-6 sm:mb-8 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Customer Service & Technical Care
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 my-0">
              READY TO WORK WITH US
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
              Bạn có câu hỏi về sản phẩm, chính sách bảo hành hay cần tư vấn giải pháp công nghệ? Hãy để lại tin nhắn hoặc ghé thăm hệ thống showroom của chúng tôi.
            </p>

            {/* Quick Assurance Badges - Optimized for mobile & tablet */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-5 mt-4 border-t border-slate-100 text-slate-700">
              <div className="flex items-center gap-2 bg-slate-50/80 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-headset text-xs" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-[11px] sm:text-xs truncate">Hỗ trợ 24/7</div>
                  <div className="text-[10px] text-slate-400 truncate">Tư vấn tức thì</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50/80 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-shield-check text-xs" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-[11px] sm:text-xs truncate">Chính Hãng 100%</div>
                  <div className="text-[10px] text-slate-400 truncate">Bảo hành 12-36T</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50/80 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-bolt text-xs" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-[11px] sm:text-xs truncate">Phản Hồi Nhanh</div>
                  <div className="text-[10px] text-slate-400 truncate">Trong 2-4 giờ</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50/80 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-truck-fast text-xs" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-[11px] sm:text-xs truncate">Giao Toàn Quốc</div>
                  <div className="text-[10px] text-slate-400 truncate">Miễn phí từ $199</div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Form Left (7 cols) + Info Right (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900 tracking-tight my-0">
                  Gửi lời nhắn cho chúng tôi
                </h2>
                <p className="text-xs text-slate-500">
                  Vui lòng điền các thông tin bên dưới, nhân viên hỗ trợ sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>
              </div>

              <ContactForm onSuccess={handleFormSuccess} />
            </div>

            {/* Right Column: Contact Info & Photo */}
            <div className="lg:col-span-5">
              <ContactInfoCard />
            </div>
          </div>
        </Card>

        {/* Map Section */}
        <ContactMapSection />
      </main>

      {/* Reused Original Project Footer */}
      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
