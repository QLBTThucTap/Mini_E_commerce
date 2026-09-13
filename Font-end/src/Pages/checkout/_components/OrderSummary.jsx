import { Link } from "react-router-dom";
import { formatMoney, formatVND } from "../_utils/checkoutUtils";

export default function OrderSummary({
  items = [],
  pricing,
  appliedDiscount = 0,
  paymentMethod = "bank",
  isSubmitting = false,
  children,
}) {
  return (
    <div className="lg:col-span-5 bg-[#eff4ff] p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
          Your Order Summary
        </h2>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006948] bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Verified Session
        </span>
      </div>

      {/* Line items review box */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/60">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-[11px] font-bold text-[#565e74] uppercase tracking-wider">
          <span>Item Description</span>
          <span>Subtotal</span>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">
              shopping_bag
            </span>
            <p className="mt-2 text-xs text-slate-500">
              Không có sản phẩm nào trong giỏ hàng.
            </p>
            <Link
              to="/"
              className="mt-3 inline-block text-xs font-bold text-[#006948] hover:underline"
            >
              Quay lại mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 pt-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-[#eff4ff] p-1 shrink-0 flex items-center justify-center border border-slate-200/50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0b1c30] truncate leading-tight">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-[#565e74]">
                      Số lượng: {item.quantity} × {formatMoney(item.price)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0b1c30] shrink-0">
                  {formatMoney(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Calculations */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-[#3d4a42]">
          <div className="flex justify-between">
            <span>Cart Subtotal</span>
            <span className="font-semibold text-[#0b1c30]">
              {formatMoney(pricing.subTotal)}
            </span>
          </div>

          {appliedDiscount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Voucher Discount (-{appliedDiscount * 100}%)</span>
              <span>-{formatMoney(pricing.discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Worldwide Insured Shipping</span>
            <span className="font-semibold text-[#006948]">
              {pricing.isFreeShipping
                ? "FREE (Đơn > $199)"
                : `+${formatMoney(pricing.rawShipping)}`}
            </span>
          </div>

          <div className="flex justify-between text-slate-500">
            <span>Regulatory Eco Tax</span>
            <span className="font-semibold text-[#0b1c30]">$0.00</span>
          </div>
        </div>

        {/* Grand Total */}
        <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
          <div>
            <span className="text-sm font-bold text-[#0b1c30] block">
              Total Due
            </span>
            <span className="text-[11px] text-[#565e74]">
              ≈ {formatVND(pricing.grandTotalVND)}
            </span>
          </div>
          <span className="text-2xl font-black text-[#006948] tracking-tight">
            {formatMoney(pricing.grandTotal)}
          </span>
        </div>
      </div>

      {/* Payment methods insertion slot */}
      {children}

      {/* Security & Submission */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="w-full h-13 bg-[#006948] hover:bg-[#00855d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-[#006948]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>ĐANG TẠO ĐƠN HÀNG...</span>
            </>
          ) : paymentMethod === "bank" ? (
            <>
              <span className="material-symbols-outlined text-[20px]">
                qr_code
              </span>
              <span>TIẾN HÀNH THANH TOÁN QR</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">lock</span>
              <span>PLACE ORDER NOW</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#6d7a72]">
          <span className="material-symbols-outlined text-[15px] text-[#006948]">
            verified
          </span>
          <span>
            Protected by 256-Bit SSL End-to-End Encryption Guarantee
          </span>
        </div>
      </div>
    </div>
  );
}
