import { useNavigate } from "react-router-dom";
import { formatMoney, formatVND } from "../_utils/checkoutUtils";

export default function CheckoutQrModal({
  show,
  orderData,
  bankInfo,
  copiedField,
  onCopy,
  onConfirmPaid,
  onClose,
}) {
  const navigate = useNavigate();

  if (!show || !orderData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in duration-200">
        {/* Header modal */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#006948] px-3 py-1 rounded-full text-xs font-extrabold mb-2">
            <span className="material-symbols-outlined text-[16px]">
              qr_code_2
            </span>
            <span>Thanh toán VietQR 24/7</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
            Quét mã QR để thanh toán
          </h3>
          <p className="text-xs text-[#565e74] mt-1">
            Đơn hàng:{" "}
            <strong className="text-[#006948] font-mono text-sm">
              #SW-{orderData.orderId}
            </strong>{" "}
            · Tổng thanh toán:{" "}
            <strong className="text-[#0b1c30] text-sm">
              {formatMoney(orderData.total)}
            </strong>{" "}
            (≈ {formatVND(orderData.totalVND)})
          </p>
        </div>

        {/* QR Code Container */}
        <div className="py-5 flex flex-col items-center justify-center">
          <div className="relative p-3 bg-white rounded-2xl border-2 border-emerald-500/80 shadow-md flex flex-col items-center">
            <img
              src={`https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-compact2.png?amount=${orderData.totalVND}&addInfo=SWOO${orderData.orderId}&accountName=${encodeURIComponent(bankInfo.accountName)}`}
              alt="Mã QR thanh toán đơn hàng"
              className="w-64 h-auto max-w-full rounded-xl object-contain"
            />
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider mt-2 uppercase">
              Quét bằng App ngân hàng bất kỳ
            </span>
          </div>
        </div>

        {/* Thông tin chuyển khoản chi tiết có nút copy */}
        <div className="bg-[#eff4ff] p-4 rounded-2xl text-xs space-y-2.5 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-[#565e74]">Ngân hàng:</span>
            <strong className="text-[#0b1c30]">{bankInfo.bankName}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#565e74]">Chủ tài khoản:</span>
            <strong className="text-[#0b1c30]">{bankInfo.accountName}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#565e74]">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <strong className="text-[#006948] font-mono text-sm">
                {bankInfo.accountNumber}
              </strong>
              <button
                type="button"
                onClick={() => onCopy(bankInfo.accountNumber, "accountNumber")}
                className="p-1 hover:bg-white rounded text-slate-500 hover:text-[#006948] transition-colors cursor-pointer"
                title="Sao chép số tài khoản"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedField === "accountNumber" ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#565e74]">Số tiền chuyển:</span>
            <div className="flex items-center gap-2">
              <strong className="text-emerald-700 font-mono text-sm">
                {formatVND(orderData.totalVND)}
              </strong>
              <button
                type="button"
                onClick={() => onCopy(String(orderData.totalVND), "amount")}
                className="p-1 hover:bg-white rounded text-slate-500 hover:text-[#006948] transition-colors cursor-pointer"
                title="Sao chép số tiền"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedField === "amount" ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#565e74]">Nội dung chuyển khoản:</span>
            <div className="flex items-center gap-2">
              <strong className="text-[#006948] font-mono text-sm bg-white px-2 py-0.5 rounded border border-slate-200">
                SWOO{orderData.orderId}
              </strong>
              <button
                type="button"
                onClick={() => onCopy(`SWOO${orderData.orderId}`, "content")}
                className="p-1 hover:bg-white rounded text-slate-500 hover:text-[#006948] transition-colors cursor-pointer"
                title="Sao chép nội dung"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedField === "content" ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Trạng thái chờ */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#565e74]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span>Sau khi chuyển khoản thành công, vui lòng bấm nút bên dưới.</span>
        </div>

        {/* Các nút hành động */}
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onConfirmPaid}
            className="w-full py-3.5 bg-[#006948] hover:bg-[#00855d] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#006948]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">
              check_circle
            </span>
            <span>ĐÃ THANH TOÁN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/");
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#565e74] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Để thanh toán sau & Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
