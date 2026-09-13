export default function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
  bankInfo,
  qrCodeUrl,
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-[#0b1c30]">
        Select Payment Gateway
      </h3>

      {/* Option 1: QR Code & Online Banking (Primary) */}
      <label
        className={`p-4 rounded-xl bg-white cursor-pointer flex flex-col gap-2 border transition-all ${
          paymentMethod === "bank"
            ? "border-[#006948] ring-2 ring-[#006948]/20 shadow-sm"
            : "border-slate-200/70 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment_method"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={() => setPaymentMethod("bank")}
              className="accent-[#006948] w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                  Thanh toán Online qua mã QR (VietQR)
                </span>
                <span className="bg-emerald-100 text-[#006948] font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                  Khuyên dùng
                </span>
              </div>
              <span className="text-[11px] text-[#565e74]">
                Quét mã QR tiện lợi qua mọi ứng dụng ngân hàng / ví điện tử
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#006948] text-[24px]">
            qr_code_scanner
          </span>
        </div>

        {paymentMethod === "bank" && (
          <div className="ml-7 mt-2 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-700">
            <div className="w-28 h-28 bg-white p-1.5 rounded-lg border border-emerald-200 shadow-xs shrink-0 flex items-center justify-center">
              <img
                src={qrCodeUrl}
                alt="VietQR Payment Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div>
                <span className="text-slate-500">Ngân hàng: </span>
                <strong className="text-slate-900">{bankInfo.bankName}</strong>
              </div>
              <div>
                <span className="text-slate-500">Số tài khoản: </span>
                <strong className="text-emerald-700 font-mono text-sm">
                  {bankInfo.accountNumber}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Chủ tài khoản: </span>
                <strong className="text-slate-900">{bankInfo.accountName}</strong>
              </div>
              <p className="text-[11px] text-emerald-800 italic pt-1">
                Bấm "TIẾN HÀNH THANH TOÁN QR" để mở mã QR chính thức kèm mã đơn hàng và hoàn tất thanh toán.
              </p>
            </div>
          </div>
        )}
      </label>

      {/* Option 2: Cash On Delivery */}
      <label
        className={`p-4 rounded-xl bg-white cursor-pointer flex items-center justify-between border transition-all ${
          paymentMethod === "cod"
            ? "border-[#006948] ring-2 ring-[#006948]/20 shadow-sm"
            : "border-slate-200/70 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="payment_method"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
            className="accent-[#006948] w-4 h-4 cursor-pointer"
          />
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
              Cash on Express Delivery (COD)
            </span>
            <p className="text-xs text-[#565e74]">
              Thanh toán tiền mặt tận nơi khi nhận hàng
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#565e74] text-[22px]">
          local_atm
        </span>
      </label>

      {/* Option 3: PayPal Express */}
      <label
        className={`p-4 rounded-xl bg-white cursor-pointer flex items-center justify-between border transition-all ${
          paymentMethod === "paypal"
            ? "border-[#006948] ring-2 ring-[#006948]/20 shadow-sm"
            : "border-slate-200/70 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="payment_method"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
            className="accent-[#006948] w-4 h-4 cursor-pointer"
          />
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
              PayPal / Credit Cards
            </span>
            <p className="text-xs text-[#565e74]">
              Thanh toán online quốc tế qua Visa, Mastercard, PayPal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-xs text-[#006948] bg-slate-100 px-2 py-1 rounded">
          <i className="fa-brands fa-paypal text-sm text-[#003087]" />
          <span>PayPal</span>
        </div>
      </label>
    </div>
  );
}
