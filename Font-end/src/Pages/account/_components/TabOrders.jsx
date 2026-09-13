import { Link } from "react-router-dom";
import { useAccountOrders } from "../_hooks/useAccountOrders";
import {
  ORDER_FILTER_TABS,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ICONS,
} from "../_utils/accountConstants";
import { formatDate, formatCurrency } from "../_utils/formatters";

export default function TabOrders({ activeTab }) {
  const {
    orders,
    loadingOrders,
    ordersError,
    productMap,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    counts,
    totalOrders,
  } = useAccountOrders(activeTab);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      {/* ── Title & Subtitle ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Đơn hàng của tôi
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {totalOrders} đơn hàng
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tiến trình giao hàng và xem lại lịch sử mua sắm của bạn.
          </p>
        </div>
      </div>

      {/* ── Status Filter Tabs (Pills) ────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {ORDER_FILTER_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          const count = counts[tab.key] || 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Search Input ──────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo Mã đơn hàng hoặc Tên sản phẩm..."
          className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {/* ── Loading State ────────────────────────────────────────────────── */}
      {loadingOrders && (
        <div className="py-12 text-center text-slate-500">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-emerald-500 mb-3 block" />
          Đang tải lịch sử đơn hàng...
        </div>
      )}

      {/* ── Error State ──────────────────────────────────────────────────── */}
      {ordersError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <i className="fa-solid fa-circle-exclamation mr-2" />
          Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.
        </div>
      )}

      {/* ── Empty State ──────────────────────────────────────────────────── */}
      {!loadingOrders && !ordersError && orders.length === 0 && (
        <div className="py-16 text-center">
          <i className="fa-solid fa-box-open text-4xl text-slate-200 mb-3 block" />
          <p className="text-slate-500 font-medium text-sm">
            {searchTerm || statusFilter !== "all"
              ? "Không tìm thấy đơn hàng phù hợp với bộ lọc."
              : "Bạn chưa có đơn hàng nào."}
          </p>
          {searchTerm || statusFilter !== "all" ? (
            <button
              onClick={() => {
                setStatusFilter("all");
                setSearchTerm("");
              }}
              className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
            >
              Xóa bộ lọc
            </button>
          ) : (
            <Link
              to="/"
              className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          )}
        </div>
      )}

      {/* ── Orders List ──────────────────────────────────────────────────── */}
      {!loadingOrders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const status = order.status || "pending";
            const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.pending;
            const statusIcon = STATUS_ICONS[status] || "fa-solid fa-circle";

            return (
              <div
                key={order.id || idx}
                className="rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all bg-white shadow-sm"
              >
                {/* Header đơn hàng */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      MÃ ĐƠN HÀNG:
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      #{order.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 font-medium">
                      <i className="fa-regular fa-clock mr-1" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusStyle}`}
                    >
                      <i className={`${statusIcon} text-[10px]`} />
                      {STATUS_LABELS[status] || status}
                    </span>
                  </div>
                </div>

                {/* Danh sách sản phẩm trong đơn */}
                <div className="divide-y divide-slate-100">
                  {(order.products || []).map((item, pIdx) => {
                    const product = productMap.get(Number(item.productId));
                    const title =
                      item.title ||
                      product?.title ||
                      `Sản phẩm #${item.productId}`;
                    const image = item.image || product?.image;
                    const price = item.price ?? product?.price;

                    return (
                      <div
                        key={pIdx}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={title}
                            className="w-14 h-14 rounded-xl object-contain border border-slate-100 bg-slate-50 shrink-0 p-1"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl border border-slate-100 bg-slate-100 flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-image text-slate-300 text-xl" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            Số lượng:{" "}
                            <span className="text-slate-700 font-bold">
                              {item.quantity}
                            </span>
                            {price !== undefined && (
                              <span className="ml-2 text-slate-400">
                                · {formatCurrency(price)} / cái
                              </span>
                            )}
                          </p>
                        </div>
                        {price !== undefined && (
                          <p className="text-sm font-extrabold text-slate-900 shrink-0">
                            {formatCurrency(price * item.quantity)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer đơn hàng */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3.5 bg-slate-50/80 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">
                    <i className="fa-solid fa-location-dot mr-1.5 text-slate-400" />
                    {order.shippingInfo?.address || "Chưa có địa chỉ"}
                    {order.shippingInfo?.fullName && (
                      <span className="ml-1.5 font-semibold text-slate-700">
                        ({order.shippingInfo.fullName})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 uppercase font-bold">
                        TỔNG TIỀN:
                      </span>
                      <span className="text-lg font-extrabold text-emerald-600">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
