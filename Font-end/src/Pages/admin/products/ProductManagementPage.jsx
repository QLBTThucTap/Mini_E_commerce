import { useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { deleteProduct, getProducts } from "../../../Services/productService";
import ProductImportModal from "./_component/ProductImportModal";
import ProductFormModal from "./_component/ProductFormModal";

const PAGE_SIZE = 10;

function ProductManagementPage() {
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({ open: false, product: null });
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    id: "",
    title: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts({ page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const products = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const errorMessage = error
    ? error.response?.data?.message || "Không thể tải danh sách sản phẩm."
    : "";

  const deleteMutation = useMutation({
    mutationFn: (productId) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      window.alert(error.response?.data?.message || "Không thể xóa sản phẩm.");
    },
  });

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const idMatched = String(product.id).includes(filters.id);
      const titleMatched = product.title
        .toLowerCase()
        .includes(filters.title.toLowerCase());
      const categoryMatched =
        !filters.category || product.category === filters.category;
      const minPriceMatched =
        !filters.minPrice || Number(product.price) >= Number(filters.minPrice);
      const maxPriceMatched =
        !filters.maxPrice || Number(product.price) <= Number(filters.maxPrice);

      return (
        idMatched &&
        titleMatched &&
        categoryMatched &&
        minPriceMatched &&
        maxPriceMatched
      );
    });
  }, [products, filters]);

  const handleDelete = (product) => {
    const accepted = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.title}" không?`,
    );
    if (!accepted) return;
    deleteMutation.mutate(product.id);
  };

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Quản lý sản phẩm
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tổng: {filteredProducts.length} / {total} sản phẩm
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
          >
            <i className="fa-solid fa-file-excel mr-2" />
            Import Excel
          </button>

          <button
            type="button"
            onClick={() =>
              setFormState({
                open: true,
                product: null,
              })
            }
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <i className="fa-solid fa-plus mr-2" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>

            <tr className="border-t border-slate-200">
              <th className="p-2">
                <input
                  value={filters.id}
                  onChange={(event) => updateFilter("id", event.target.value)}
                  placeholder="ID"
                  className="w-20 rounded border border-slate-300 px-2 py-1.5 text-xs font-normal"
                />
              </th>

              <th />

              <th className="p-2">
                <input
                  value={filters.title}
                  onChange={(event) =>
                    updateFilter("title", event.target.value)
                  }
                  placeholder="Lọc theo tên"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs font-normal"
                />
              </th>

              <th className="p-2">
                <select
                  value={filters.category}
                  onChange={(event) =>
                    updateFilter("category", event.target.value)
                  }
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs font-normal"
                >
                  <option value="">Tất cả</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </th>

              <th className="p-2">
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(event) =>
                      updateFilter("minPrice", event.target.value)
                    }
                    placeholder="Từ"
                    className="w-20 rounded border border-slate-300 px-2 py-1.5 text-xs font-normal"
                  />

                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(event) =>
                      updateFilter("maxPrice", event.target.value)
                    }
                    placeholder="Đến"
                    className="w-20 rounded border border-slate-300 px-2 py-1.5 text-xs font-normal"
                  />
                </div>
              </th>

              <th />
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-12 text-center text-slate-500"
                >
                  Đang tải sản phẩm...
                </td>
              </tr>
            )}

            {!loading && filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-12 text-center text-slate-500"
                >
                  Không tìm thấy sản phẩm phù hợp.
                </td>
              </tr>
            )}

            {!loading &&
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-semibold">#{product.id}</td>

                  <td className="px-4 py-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-12 w-12 rounded-lg bg-slate-100 object-cover"
                    />
                  </td>

                  <td className="max-w-xs px-4 py-3 font-semibold text-slate-800">
                    {product.title}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-bold text-emerald-600">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormState({
                            open: true,
                            product,
                          })
                        }
                        className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deleteMutation.isPending}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-slate-500">
          Trang {page}/{totalPages} — Tổng {total} sản phẩm
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
        <ProductFormModal
          product={formState.product}
          onClose={() => setFormState({ open: false, product: null })}
          onSaved={handleSaved}
        />
      )}

      {isImportOpen && (
        <ProductImportModal
          onClose={() => setIsImportOpen(false)}
          onImported={handleSaved}
        />
      )}
    </main>
  );
}

export default ProductManagementPage;
