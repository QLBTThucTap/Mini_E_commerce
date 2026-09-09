import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProduct,
  updateProduct,
  getCategories,
} from "../../../../Services/productService";

import { productSchema } from "../_schema/productSchema";

const emptyProduct = {
  title: "",
  price: "",
  category: "",
  description: "",
  image: "",
};

function ProductFormModal({ product, onClose, onSaved }) {
  const [serverError, setServerError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: emptyProduct,
  });

  useEffect(() => {
    reset(
      product
        ? {
            title: product.title ?? "",
            price: product.price ?? "",
            category: product.category ?? "",
            description: product.description ?? "",
            image: product.image ?? "",
          }
        : emptyProduct,
    );
  }, [product, reset]);

  const onSubmit = async (data) => {
    try {
      setServerError("");

      if (product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }

      await onSaved();
      onClose();
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Không thể lưu sản phẩm. Vui lòng thử lại.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">
            {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
          noValidate
        >
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Tên sản phẩm
            </label>
            <input
              {...register("title")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Giá
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              {...register("price")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Danh mục
            </label>

            <select
              {...register("category")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => {
                return (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                );
              })}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Link ảnh
            </label>
            <input
              {...register("image")}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
            {errors.image && (
              <p className="mt-1 text-xs text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Mô tả
            </label>
            <textarea
              rows="5"
              {...register("description")}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
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
              {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
