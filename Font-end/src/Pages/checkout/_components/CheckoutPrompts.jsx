import { Link } from "react-router-dom";

export default function CheckoutPrompts({
  isAuthenticated,
  user,
  showVoucherInput,
  setShowVoucherInput,
  voucherCode,
  setVoucherCode,
  appliedDiscount,
  voucherMessage,
  onApplyVoucher,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Login Prompt Card */}
      <div className="bg-[#eff4ff] p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm text-[#3d4a42] border border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#006948] shrink-0">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
          {isAuthenticated && user ? (
            <div>
              <span>Đã đăng nhập: </span>
              <strong className="text-[#0b1c30]">
                {user.fullName || user.username || user.email}
              </strong>
            </div>
          ) : (
            <div>
              <span>Khách hàng quen thuộc? </span>
              <Link
                to="/login"
                className="text-[#006948] font-bold hover:underline"
              >
                Bấm vào đây để đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Voucher Prompt Card */}
      <div className="bg-[#eff4ff] p-4 rounded-xl flex flex-col justify-center text-xs sm:text-sm text-[#3d4a42] border border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[#825100] shrink-0">
              <span className="material-symbols-outlined text-[20px]">redeem</span>
            </div>
            <span>
              Có mã giảm giá?{" "}
              <button
                type="button"
                onClick={() => setShowVoucherInput((prev) => !prev)}
                className="text-[#006948] font-bold hover:underline cursor-pointer"
              >
                {showVoucherInput ? "Ẩn nhập mã" : "Nhập mã voucher"}
              </button>
            </span>
          </div>
          {appliedDiscount > 0 && (
            <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
              -{appliedDiscount * 100}%
            </span>
          )}
        </div>

        {/* Collapsible Coupon Input */}
        {showVoucherInput && (
          <form
            onSubmit={onApplyVoucher}
            className="mt-3 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              placeholder="Nhập mã (VD: SWOO10, SWOO20)..."
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#0b1c30] uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#006948]/30"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Áp dụng
            </button>
          </form>
        )}

        {voucherMessage?.text && (
          <p
            className={`mt-2 text-xs font-semibold ${
              voucherMessage.type === "success"
                ? "text-emerald-700"
                : "text-red-600"
            }`}
          >
            {voucherMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}
