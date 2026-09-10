import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getAllOrders } from "../../../Services/orderService";
import { getProducts } from "../../../Services/productService";
import { deleteOrder } from "../../../Services/orderService";
import OrderFormModal from "./_component/OrderFormModal";

const PAGE_SIZE = 10;

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

function OrderManagementPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ open: false, order: null });

  const deleteMutation = useMutation({
    mutationFn: (orderId) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => {
      window.alert(error.response?.data?.message || "Không thể xóa đơn hàng.");
    },
  });

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const handleDelete = (order) => {
    const accepted = window.confirm(
      `Bạn có chắc muốn xóa đơn hàng #${order.id} không?`,
    );
    if (!accepted) return;
    deleteMutation.mutate(order.id);
  };

  const {
    data: orders,
    isLoading: loadingOrders,
    error: orderError,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrders,
  });

  // Lấy toàn bộ sản phẩm 1 lần để tra cứu tên theo productId (tránh gọi API lặp lại cho từng đơn)
  const {
    data: productData,
    isLoading: loadingProducts,
    error: productError,
  } = useQuery({
    queryKey: ["admin-orders-products"],
    queryFn: () => getProducts({ page: 1, pageSize: 1000 }),
  });

  const loading = loadingOrders || loadingProducts;

  const errorMessage = orderError
    ? orderError.response?.data?.message || "Không thể tải danh sách đơn hàng."
    : productError
      ? productError.response?.data?.message ||
        "Không thể tải danh sách sản phẩm."
      : "";

  const productMap = useMemo(() => {
    const items = productData?.items ?? [];
    return new Map(items.map((product) => [product.id, product]));
  }, [productData]);

  const sortedOrders = useMemo(() => {
    const list = orders ?? [];
    return [...list].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [orders]);

  const total = sortedOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedOrders.slice(start, start + PAGE_SIZE);
  }, [sortedOrders, page]);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Quản lý đơn hàng
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Tổng: {total} đơn hàng
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFormState({ open: true, order: null })}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <i className="fa-solid fa-plus mr-2" />
            Thêm đơn hàng
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Sản phẩm đã đặt</th>
              <th className="px-4 py-3 text-center">Số lượng</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày đặt</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-12 text-center text-slate-500"
                >
                  Đang tải đơn hàng...
                </td>
              </tr>
            )}

            {!loading && paginatedOrders.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-12 text-center text-slate-500"
                >
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}

            {!loading &&
              paginatedOrders.map((order) => {
                const items = order.products ?? [];
                const totalQuantity = items.reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0,
                );

                // Đơn hàng cũ (seed thủ công) có thể thiếu field "total".
                // Trường hợp đó, tự tính lại từ price trong productMap thay vì hiển thị $0.00.
                const computedTotal = items.reduce((sum, item) => {
                  const product = productMap.get(item.productId);
                  return (
                    sum + (product?.price || 0) * Number(item.quantity || 0)
                  );
                }, 0);
                const displayTotal =
                  order.total !== undefined && order.total !== null
                    ? order.total
                    : computedTotal;

                return (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 align-top hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-semibold">#{order.id}</td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">
                        {order.shippingInfo?.fullName || "—"}
                      </p>
                      {order.shippingInfo?.phone && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {order.shippingInfo.phone}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <ul className="space-y-1">
                        {items.map((item) => {
                          const product = productMap.get(item.productId);
                          return (
                            <li key={item.productId} className="text-slate-700">
                              {product?.title || `SP #${item.productId}`}{" "}
                              <span className="text-xs text-slate-400">
                                x{item.quantity}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </td>

                    <td className="px-4 py-3 text-center font-semibold">
                      {totalQuantity}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-bold ${
                          STATUS_COLORS[order.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-emerald-600">
                      {formatCurrency(displayTotal)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setFormState({ open: true, order })}
                          className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(order)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-slate-500">
          Trang {page}/{totalPages} — Tổng {total} đơn hàng
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => goToPage(pageNumber)}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-semibold",
                  pageNumber === page
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 hover:bg-slate-50",
                ].join(" ")}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>
      {formState.open && (
        <OrderFormModal
          order={formState.order}
          onClose={() => setFormState({ open: false, order: null })}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}

export default OrderManagementPage;
