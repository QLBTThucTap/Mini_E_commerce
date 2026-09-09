import { useState } from "react";
import * as XLSX from "xlsx";

import { createProduct } from "../../../../Services/productService";
import { productSchema } from "../_schema/productSchema";

function ProductImportModal({ onClose, onImported }) {
  const [rows, setRows] = useState([]);
  const [fileError, setFileError] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const validRows = rows.filter((row) => row.valid);
  const invalidRows = rows.filter((row) => !row.valid);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setRows([]);
    setFileError("");

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      setFileError("Chỉ chấp nhận file .xlsx hoặc .xls");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawRows = XLSX.utils.sheet_to_json(firstSheet, {
        defval: "",
      });

      if (rawRows.length === 0) {
        setFileError("File Excel không có dữ liệu.");
        return;
      }

      const parsedRows = rawRows.map((rawRow, index) => {
        const row = Object.fromEntries(
          Object.entries(rawRow).map(([key, value]) => [
            key.trim().toLowerCase(),
            value,
          ]),
        );

        const result = productSchema.safeParse({
          title: row.title,
          price: row.price,
          category: row.category,
          description: row.description,
          image: row.image,
        });

        return {
          rowNumber: index + 2,
          data: result.success ? result.data : null,
          valid: result.success,
          errors: result.success
            ? []
            : result.error.issues.map((issue) => issue.message),
        };
      });

      setRows(parsedRows);
    } catch {
      setFileError("Không thể đọc file Excel.");
    }
  };

  const handleImport = async () => {
    if (invalidRows.length > 0 || validRows.length === 0) return;

    try {
      setIsImporting(true);

      for (const row of validRows) {
        await createProduct(row.data);
      }

      await onImported();
      onClose();
    } catch (error) {
      setFileError(
        error.response?.data?.message ||
          "Import bị dừng. Một số sản phẩm có thể đã được thêm.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Import sản phẩm từ Excel
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Cột bắt buộc: title, price, category.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="mt-6 block w-full rounded-lg border border-slate-300 p-2 text-sm"
        />

        {fileError && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {fileError}
          </p>
        )}

        {rows.length > 0 && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-sm text-slate-500">Dòng hợp lệ</p>
                <p className="text-2xl font-extrabold text-emerald-600">
                  {validRows.length}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-sm text-slate-500">Dòng lỗi</p>
                <p className="text-2xl font-extrabold text-red-600">
                  {invalidRows.length}
                </p>
              </div>
            </div>

            <div className="mt-5 max-h-60 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="sticky top-0 bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-3">Dòng</th>
                    <th className="p-3">Trạng thái</th>
                    <th className="p-3">Lỗi</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.rowNumber}
                      className="border-t border-slate-100"
                    >
                      <td className="p-3">{row.rowNumber}</td>
                      <td className="p-3">
                        <span
                          className={
                            row.valid
                              ? "font-bold text-emerald-600"
                              : "font-bold text-red-600"
                          }
                        >
                          {row.valid ? "Hợp lệ" : "Không hợp lệ"}
                        </span>
                      </td>
                      <td className="p-3 text-red-600">
                        {row.errors.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={
              isImporting || validRows.length === 0 || invalidRows.length > 0
            }
            onClick={handleImport}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300"
          >
            {isImporting
              ? "Đang import..."
              : `Import ${validRows.length} sản phẩm`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductImportModal;
