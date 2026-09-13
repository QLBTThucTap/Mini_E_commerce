import { useNavigate } from "react-router-dom";
import { formatMoney } from "../_utils/checkoutUtils";

export default function CheckoutSuccessModal({
  show,
  orderData,
  isAuthenticated,
}) {
  const navigate = useNavigate();

  if (!show || !orderData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#006948] flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <h3 className="text-2xl font-extrabold text-center text-[#0b1c30]">
          Đặt hàng thành công!
        </h3>
        <p className="text-center text-xs sm:text-sm text-[#565e74] mt-1">
          Mã đơn hàng của bạn là:{" "}
          <strong className="text-[#006948]">
            #SW-{orderData.orderId}
          </strong>
        </p>

        <div className="mt-6 bg-[#eff4ff] p-4 rounded-xl text-xs space-y-2 border border-slate-200/60">
          <div className="flex justify-between">
            <span className="text-[#565e74]">Người nhận:</span>
            <strong className="text-[#0b1c30]">
              {orderData.shippingInfo.fullName}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#565e74]">Số điện thoại:</span>
            <strong className="text-[#0b1c30]">
              {orderData.shippingInfo.phone}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#565e74]">Địa chỉ:</span>
            <span className="text-[#0b1c30] text-right font-medium max-w-xs truncate">
              {orderData.shippingInfo.address}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#565e74]">Phương thức thanh toán:</span>
            <span className="capitalize font-bold text-[#006948]">
              {orderData.paymentMethod === "bank"
                ? "Chuyển khoản QR ngân hàng"
                : orderData.paymentMethod === "cod"
                  ? "Thu hộ tiền mặt (COD)"
                  : "PayPal / Thẻ trực tuyến"}
            </span>
          </div>
          <div className="border-t border-slate-200/80 pt-2 flex justify-between text-sm">
            <span className="font-bold text-[#0b1c30]">Tổng thanh toán:</span>
            <strong className="text-base text-[#006948]">
              {formatMoney(orderData.total)}
            </strong>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                navigate("/account?tab=orders", {
                  state: { tab: "orders" },
                });
              } else {
                navigate("/login", {
                  state: { from: "/account?tab=orders" },
                });
              }
            }}
            className="w-full py-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006948] font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Xem lịch sử đơn hàng
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-2.5 bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Tiếp tục mua hàng
          </button>
        </div>
      </div>
    </div>
  );
}
