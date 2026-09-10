import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../../../Services/productService";
import { getAllOrders } from "../../../Services/orderService";

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700",
  shipping: "bg-blue-50 text-blue-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DashboardPage() {
  const {
    data: productMeta,
    isLoading: loadingProducts,
    error: productError,
  } = useQuery({
    queryKey: ["dashboard-products-meta"],
    // Chỉ cần lấy 1 sản phẩm để đọc field "total" trong meta phân trang,
    // tránh tải cả danh sách sản phẩm chỉ để đếm số lượng
    queryFn: () => getProducts({ page: 1, pageSize: 1 }),
  });

  const {
    data: orders,
    isLoading: loadingOrders,
    error: orderError,
  } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: getAllOrders,
  });

  // Lấy toàn bộ sản phẩm để tính bù "total" cho các đơn hàng cũ bị thiếu field này
  const { data: productData, isLoading: loadingProductList } = useQuery({
    queryKey: ["dashboard-products-full"],
    queryFn: () => getProducts({ page: 1, pageSize: 1000 }),
  });

  const loading = loadingProducts || loadingOrders || loadingProductList;

  const errorMessage = productError
    ? productError.response?.data?.message || "Không thể tải số liệu sản phẩm."
    : orderError
      ? orderError.response?.data?.message || "Không thể tải số liệu đơn hàng."
      : "";

  const totalProducts = productMeta?.total ?? 0;

  const productMap = useMemo(() => {
    const items = productData?.items ?? [];
    return new Map(items.map((product) => [product.id, product]));
  }, [productData]);

  // Đơn hàng cũ (seed thủ công) có thể thiếu field "total" → tính lại từ price nếu vậy
  const getOrderTotal = (order) => {
    if (order.total !== undefined && order.total !== null) {
      return Number(order.total);
    }
    const items = order.products ?? [];
    return items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product?.price || 0) * Number(item.quantity || 0);
    }, 0);
  };

  const stats = useMemo(() => {
    const list = orders ?? [];
    const totalOrders = list.length;

    // Doanh thu tính trên các đơn chưa bị hủy
    const totalRevenue = list.reduce((sum, order) => {
      if (order.status === "cancelled") return sum;
      return sum + getOrderTotal(order);
    }, 0);

    const statusCounts = list.reduce((acc, order) => {
      const key = order.status || "pending";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const recentOrders = [...list]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return { totalOrders, totalRevenue, statusCounts, recentOrders };
  }, [orders, productMap]);

  // Bộ lọc "Xem thống kê": input người dùng đang gõ (chưa áp dụng)
  const currentDate = new Date();
  const [yearInput, setYearInput] = useState(String(currentDate.getFullYear()));
  const [quarterInput, setQuarterInput] = useState(
    Math.floor(currentDate.getMonth() / 3) + 1,
  );

  // Bộ lọc đã áp dụng (chỉ đổi khi bấm "Xem thống kê")
  const [appliedFilter, setAppliedFilter] = useState({
    year: currentDate.getFullYear(),
    quarter: Math.floor(currentDate.getMonth() / 3) + 1,
  });

  const handleViewStats = () => {
    const year = Number(yearInput);
    const quarter = Number(quarterInput);
    if (!year || year < 2000) {
      window.alert("Vui lòng nhập năm hợp lệ");
      return;
    }
    setAppliedFilter({ year, quarter });
  };

  // 3 tháng (0-indexed) thuộc quý đang được chọn, ví dụ Quý 3 -> [6, 7, 8]
  const quarterMonths = useMemo(() => {
    const startMonth = (appliedFilter.quarter - 1) * 3;
    return [startMonth, startMonth + 1, startMonth + 2];
  }, [appliedFilter.quarter]);

  // Doanh thu từng tháng trong quý đã chọn (dùng chung fallback getOrderTotal)
  const monthlyRevenue = useMemo(() => {
    const list = orders ?? [];
    const revenueByMonth = new Map();
    quarterMonths.forEach((month) => revenueByMonth.set(month, 0));

    list.forEach((order) => {
      if (order.status === "cancelled") return;
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);
      if (date.getFullYear() !== appliedFilter.year) return;
      if (!quarterMonths.includes(date.getMonth())) return;

      const amount = getOrderTotal(order);
      revenueByMonth.set(
        date.getMonth(),
        (revenueByMonth.get(date.getMonth()) || 0) + amount,
      );
    });

    return quarterMonths.map((month) => ({
      month,
      label: `Tháng ${month + 1}`,
      revenue: revenueByMonth.get(month) || 0,
    }));
  }, [orders, productMap, quarterMonths, appliedFilter.year]);

  const quarterTotalRevenue = useMemo(
    () => monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0),
    [monthlyRevenue],
  );

  const maxMonthlyRevenue = Math.max(
    ...monthlyRevenue.map((item) => item.revenue),
    1,
  );

  const summaryCards = [
    {
      label: "Tổng sản phẩm",
      value: totalProducts,
      icon: "fa-box",
      accent: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Tổng đơn hàng",
      value: stats.totalOrders,
      icon: "fa-receipt",
      accent: "bg-blue-100 text-blue-600",
    },
    {
      label: "Doanh thu",
      value: formatCurrency(stats.totalRevenue),
      icon: "fa-sack-dollar",
      accent: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Bảng thống kê tổng quan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tổng quan về sản phẩm, đơn hàng và doanh thu của cửa hàng
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${card.accent}`}
            >
              <i className={`fa-solid ${card.icon}`} />
            </div>

            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {loading ? "…" : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-1">
          <h2 className="text-lg font-extrabold text-slate-900">
            Đơn hàng theo trạng thái
          </h2>

          {loading && (
            <p className="mt-4 text-sm text-slate-500">Đang tải...</p>
          )}

          {!loading && stats.totalOrders === 0 && (
            <p className="mt-4 text-sm text-slate-500">Chưa có đơn hàng nào.</p>
          )}

          {!loading && stats.totalOrders > 0 && (
            <div className="mt-4 space-y-3">
              {Object.entries(stats.statusCounts).map(([status, count]) => {
                const percent = Math.round((count / stats.totalOrders) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          STATUS_COLORS[status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {STATUS_LABELS[status] || status}
                      </span>
                      <span className="font-semibold text-slate-600">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-lg font-extrabold text-slate-900">
            Đơn hàng gần đây
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2">Mã đơn</th>
                  <th className="pb-2">Khách hàng</th>
                  <th className="pb-2">Trạng thái</th>
                  <th className="pb-2">Ngày đặt</th>
                  <th className="pb-2 text-right">Tổng tiền</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">
                      Đang tải...
                    </td>
                  </tr>
                )}

                {!loading && stats.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">
                      Chưa có đơn hàng nào.
                    </td>
                  </tr>
                )}

                {!loading &&
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-100">
                      <td className="py-3 font-semibold">#{order.id}</td>
                      <td className="py-3">
                        {order.shippingInfo?.fullName || "—"}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            STATUS_COLORS[order.status] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-600">
                        {formatCurrency(getOrderTotal(order))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-extrabold text-slate-900">
          Doanh thu theo quý
        </h2>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Năm
            </label>
            <input
              type="number"
              value={yearInput}
              onChange={(event) => setYearInput(event.target.value)}
              className="w-32 rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Quý
            </label>
            <select
              value={quarterInput}
              onChange={(event) => setQuarterInput(Number(event.target.value))}
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            >
              <option value={1}>Quý 1</option>
              <option value={2}>Quý 2</option>
              <option value={3}>Quý 3</option>
              <option value={4}>Quý 4</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleViewStats}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Xem thống kê
          </button>
        </div>

        <div className="mt-6 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/40 p-5">
          <p className="text-sm text-slate-500">
            Tổng doanh thu quý {appliedFilter.quarter}/{appliedFilter.year}
          </p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-700">
            {loading ? "…" : formatCurrency(quarterTotalRevenue)}
          </p>
        </div>

        {!loading && quarterTotalRevenue === 0 && (
          <p className="mt-4 text-sm text-slate-500">
            Không có doanh thu nào trong quý này.
          </p>
        )}

        {!loading && (
          <div className="mt-6 flex items-end gap-6 overflow-x-auto pb-1">
            {monthlyRevenue.map((item) => {
              const heightPercent = Math.max(
                (item.revenue / maxMonthlyRevenue) * 100,
                2,
              );

              return (
                <div
                  key={item.month}
                  className="flex min-w-[100px] flex-1 flex-col items-center"
                >
                  <div className="flex h-48 w-full items-end">
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${heightPercent}%`,
                        background:
                          "linear-gradient(180deg, #2563eb 0%, #0d9488 100%)",
                      }}
                      title={`${item.label}: ${formatCurrency(item.revenue)}`}
                    />
                  </div>

                  <span className="mt-3 text-sm font-bold text-slate-800">
                    {item.label}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default DashboardPage;
