import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import {
  createOrderByAdmin,
  updateOrder,
} from "../../../../Services/orderService";
import { getProducts } from "../../../../Services/productService";

import { orderSchema } from "../_schema/orderSchema";

const emptyOrder = {
  shippingInfo: { fullName: "", phone: "", address: "" },
  paymentMethod: "cod",
  status: "pending",
  products: [{ productId: "", quantity: 1 }],
};

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function OrderFormModal({ order, onClose, onSaved }) {
  const [serverError, setServerError] = useState("");

  // Lấy toàn bộ sản phẩm để làm dropdown chọn + tính giá xem trước
  const { data: productData, isLoading: loadingProducts } = useQuery({
    queryKey: ["order-form-products"],
    queryFn: () => getProducts({ page: 1, pageSize: 1000 }),
  });

  const productList = productData?.items ?? [];
  const productMap = useMemo(
    () => new Map(productList.map((p) => [p.id, p])),
    [productList],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: emptyOrder,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const watchedProducts = useWatch({ control, name: "products" });

  useEffect(() => {
    reset(
      order
        ? {
            shippingInfo: {
              fullName: order.shippingInfo?.fullName ?? "",
              phone: order.shippingInfo?.phone ?? "",
              address: order.shippingInfo?.address ?? "",
            },
            paymentMethod: order.paymentMethod ?? "cod",
            status: order.status ?? "pending",
            products:
              order.products?.length > 0
                ? order.products.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                  }))
                : emptyOrder.products,
          }
        : emptyOrder,
    );
  }, [order, reset]);

  const previewTotal = useMemo(() => {
    return (watchedProducts ?? []).reduce((sum, item) => {
      const product = productMap.get(Number(item.productId));
      const quantity = Number(item.quantity) || 0;
      return sum + (product?.price || 0) * quantity;
    }, 0);
  }, [watchedProducts, productMap]);

  const onSubmit = async (data) => {
    try {
      setServerError("");

      if (order) {
        await updateOrder(order.id, data);
      } else {
        await createOrderByAdmin(data);
      }

      await onSaved();
      onClose();
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Không thể lưu đơn hàng. Vui lòng thử lại.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">
            {order ? `Cập nhật đơn hàng #${order.id}` : "Thêm đơn hàng"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        {serverError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6" noValidate>
          <h3 className="text-sm font-bold text-slate-700">
            Thông tin khách hàng
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Họ tên
              </label>
              <input
                {...register("shippingInfo.fullName")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
              {errors.shippingInfo?.fullName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.shippingInfo.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Số điện thoại
              </label>
              <input
                {...register("shippingInfo.phone")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
              {errors.shippingInfo?.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.shippingInfo.phone.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Địa chỉ giao hàng
              </label>
              <input
                {...register("shippingInfo.address")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
              {errors.shippingInfo?.address && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.shippingInfo.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Phương thức thanh toán
              </label>
              <select
                {...register("paymentMethod")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="bank_transfer">Chuyển khoản</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Trạng thái
              </label>
              <select
                {...register("status")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Sản phẩm</h3>
            <button
              type="button"
              onClick={() => append({ productId: "", quantity: 1 })}
              className="rounded-lg border border-emerald-600 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50"
            >
              <i className="fa-solid fa-plus mr-1" />
              Thêm sản phẩm
            </button>
          </div>

          {errors.products?.message && (
            <p className="mt-2 text-xs text-red-600">
              {errors.products.message}
            </p>
          )}

          <div className="mt-3 space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-start"
              >
                <div className="flex-1">
                  <select
                    {...register(`products.${index}.productId`)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  >
                    <option value="">
                      {loadingProducts
                        ? "Đang tải sản phẩm..."
                        : "-- Chọn sản phẩm --"}
                    </option>
                    {productList.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title} — {formatCurrency(product.price)}
                      </option>
                    ))}
                  </select>
                  {errors.products?.[index]?.productId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.products[index].productId.message}
                    </p>
                  )}
                </div>

                <div className="w-full sm:w-28">
                  <input
                    type="number"
                    min="1"
                    {...register(`products.${index}.quantity`)}
                    placeholder="SL"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                  {errors.products?.[index]?.quantity && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.products[index].quantity.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-500">Tổng tiền tạm tính:</span>
            <span className="text-lg font-extrabold text-emerald-600">
              {formatCurrency(previewTotal)}
            </span>
          </div>
          <p className="mt-1 text-right text-xs text-slate-400">
            Tổng tiền chính thức sẽ được máy chủ tính lại khi lưu.
          </p>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu đơn hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderFormModal;
