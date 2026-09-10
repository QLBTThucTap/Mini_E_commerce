import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../../Stores/authStore";
import {
  getUsers,
  deleteUser,
  toggleLockUser,
} from "../../../Services/userService";
import UserFormModal from "./_component/UserFormModal";

const PAGE_SIZE = 10;

function UserManagementPage() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState({ open: false, user: null });

  const [filters, setFilters] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });

  const {
    data: rawUsers,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers,
  });

  const users = rawUsers ?? [];
  const errorMessage = error
    ? error.response?.data?.message || "Không thể tải danh sách tài khoản."
    : "";

  const deleteMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      window.alert(err.response?.data?.message || "Không thể xóa người dùng.");
    },
  });

  const lockMutation = useMutation({
    mutationFn: ({ userId, isLocked }) => toggleLockUser(userId, isLocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      window.alert(
        err.response?.data?.message ||
          "Không thể đổi trạng thái khóa của tài khoản.",
      );
    },
  });

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1); // Reset về trang đầu khi lọc
  };

  const resetFilters = () => {
    setFilters({
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "",
    });
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const uName = (
        u.fullName ||
        (typeof u.name === "string"
          ? u.name
          : typeof u.name === "object"
            ? `${u.name.firstname || ""} ${u.name.lastname || ""}`.trim()
            : u.username || "")
      ).toLowerCase();

      const uEmail = (u.email || "").toLowerCase();
      const uPhone = (u.phoneNumber || u.phone || "").toLowerCase();
      const uRole = u.role === "admin" ? "admin" : "user";
      const uLocked = Boolean(u.isLocked);

      const idMatch = !filters.id || String(u.id).includes(filters.id.trim());
      const nameMatch =
        !filters.name || uName.includes(filters.name.trim().toLowerCase());
      const emailMatch =
        !filters.email || uEmail.includes(filters.email.trim().toLowerCase());
      const phoneMatch =
        !filters.phone || uPhone.includes(filters.phone.trim().toLowerCase());
      const roleMatch = !filters.role || uRole === filters.role;

      let statusMatch = true;
      if (filters.status === "active") {
        statusMatch = !uLocked;
      } else if (filters.status === "locked") {
        statusMatch = uLocked;
      }

      return (
        idMatch &&
        nameMatch &&
        emailMatch &&
        phoneMatch &&
        roleMatch &&
        statusMatch
      );
    });
  }, [users, filters]);

  const total = users.length;
  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  const handleDelete = (targetUser) => {
    if (Number(targetUser.id) === Number(currentUser?.id)) {
      window.alert("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }

    const displayName =
      targetUser.fullName || targetUser.email || `ID #${targetUser.id}`;
    const accepted = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${displayName}" không? Thao tác này không thể hoàn tác!`,
    );
    if (!accepted) return;

    deleteMutation.mutate(targetUser.id);
  };

  const handleToggleLock = (targetUser) => {
    if (Number(targetUser.id) === Number(currentUser?.id)) {
      window.alert("Bạn không thể tự khóa tài khoản của chính mình!");
      return;
    }

    const nextLocked = !targetUser.isLocked;
    const actionText = nextLocked ? "KHÓA" : "MỞ KHÓA";
    const displayName =
      targetUser.fullName || targetUser.email || `ID #${targetUser.id}`;

    const accepted = window.confirm(
      `Bạn có chắc chắn muốn ${actionText} tài khoản "${displayName}" không?`,
    );
    if (!accepted) return;

    lockMutation.mutate({ userId: targetUser.id, isLocked: nextLocked });
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Quản lý tài khoản
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tổng: {totalFiltered} / {total} tài khoản
            {hasActiveFilters && " (đang lọc)"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <i className="fa-solid fa-rotate-left mr-1.5" />
              Xóa bộ lọc
            </button>
          )}

          <button
            type="button"
            onClick={() => setFormState({ open: true, user: null })}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-user-plus" />
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          <i className="fa-solid fa-circle-exclamation mr-2" />
          {errorMessage}
        </div>
      )}

      {/* Table Container */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold w-16 text-center">ID</th>
              <th className="px-4 py-3 font-bold">Họ và tên</th>
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="px-4 py-3 font-bold">Số điện thoại</th>
              <th className="px-4 py-3 font-bold text-center w-36">Vai trò</th>
              <th className="px-4 py-3 font-bold text-center w-36">
                Trạng thái
              </th>
              <th className="px-4 py-3 font-bold text-right w-44">Thao tác</th>
            </tr>

            {/* Hàng bộ lọc từng cột */}
            <tr className="border-t border-slate-200 bg-slate-50/80">
              {/* Lọc ID */}
              <th className="p-2">
                <input
                  type="text"
                  value={filters.id}
                  onChange={(e) => updateFilter("id", e.target.value)}
                  placeholder="Lọc ID"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs font-normal text-center focus:border-emerald-500 focus:outline-none"
                />
              </th>

              {/* Lọc Họ và tên */}
              <th className="p-2">
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => updateFilter("name", e.target.value)}
                  placeholder="Lọc theo họ tên"
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-normal focus:border-emerald-500 focus:outline-none"
                />
              </th>

              {/* Lọc Email */}
              <th className="p-2">
                <input
                  type="text"
                  value={filters.email}
                  onChange={(e) => updateFilter("email", e.target.value)}
                  placeholder="Lọc theo email"
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-normal focus:border-emerald-500 focus:outline-none"
                />
              </th>

              {/* Lọc Số điện thoại */}
              <th className="p-2">
                <input
                  type="text"
                  value={filters.phone}
                  onChange={(e) => updateFilter("phone", e.target.value)}
                  placeholder="Lọc theo SĐT"
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-normal focus:border-emerald-500 focus:outline-none"
                />
              </th>

              {/* Lọc Vai trò */}
              <th className="p-2">
                <select
                  value={filters.role}
                  onChange={(e) => updateFilter("role", e.target.value)}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-normal focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Tất cả</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </th>

              {/* Lọc Trạng thái */}
              <th className="p-2">
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-normal focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Tất cả</option>
                  <option value="active">Hoạt động</option>
                  <option value="locked">Đã khóa</option>
                </select>
              </th>

              {/* Thao tác header filter */}
              <th className="p-2 text-right">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    title="Xóa bộ lọc"
                    className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1"
                  >
                    <i className="fa-solid fa-xmark mr-1" />
                    Reset
                  </button>
                )}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-12 text-center text-slate-500"
                >
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                  Đang tải danh sách tài khoản...
                </td>
              </tr>
            )}

            {!loading && paginatedUsers.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-12 text-center text-slate-500"
                >
                  <i className="fa-solid fa-user-slash text-3xl text-slate-300 mb-2 block" />
                  Không tìm thấy tài khoản nào phù hợp.
                </td>
              </tr>
            )}

            {!loading &&
              paginatedUsers.map((item) => {
                const isSelf = Number(item.id) === Number(currentUser?.id);
                const isLocked = Boolean(item.isLocked);
                const role = item.role === "admin" ? "admin" : "user";

                const displayName =
                  item.fullName ||
                  (typeof item.name === "string"
                    ? item.name
                    : typeof item.name === "object"
                      ? `${item.name.firstname || ""} ${item.name.lastname || ""}`.trim()
                      : item.username || "—");

                const phone = item.phoneNumber || item.phone || "—";

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isLocked ? "bg-red-50/30" : ""
                    }`}
                  >
                    {/* ID */}
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-500 text-xs">
                      #{item.id}
                    </td>

                    {/* Họ và tên */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {displayName}
                          </p>
                          {isSelf && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                              Bạn đang đăng nhập
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 text-slate-600">
                      {item.email || "—"}
                    </td>

                    {/* Số điện thoại */}
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-xs">
                      {phone}
                    </td>

                    {/* Vai trò */}
                    <td className="px-4 py-3.5 text-center">
                      {role === "admin" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                          <i className="fa-solid fa-shield-halved text-[10px]" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                          <i className="fa-regular fa-user text-[10px]" />
                          User
                        </span>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-3.5 text-center">
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                          <i className="fa-solid fa-lock text-[10px]" />
                          Đã khóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <i className="fa-solid fa-check text-[10px]" />
                          Hoạt động
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Nút Khóa / Mở khóa */}
                        <button
                          type="button"
                          disabled={isSelf || lockMutation.isPending}
                          onClick={() => handleToggleLock(item)}
                          title={
                            isSelf
                              ? "Không thể khóa chính mình"
                              : isLocked
                                ? "Mở khóa tài khoản"
                                : "Khóa tài khoản"
                          }
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            isLocked
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          }`}
                        >
                          <i
                            className={`mr-1 ${
                              isLocked
                                ? "fa-solid fa-lock-open"
                                : "fa-solid fa-lock"
                            }`}
                          />
                          {isLocked ? "Mở khóa" : "Khóa"}
                        </button>

                        {/* Nút Sửa */}
                        <button
                          type="button"
                          onClick={() =>
                            setFormState({ open: true, user: item })
                          }
                          title="Chỉnh sửa tài khoản"
                          className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <i className="fa-solid fa-pen-to-square mr-1" />
                          Sửa
                        </button>

                        {/* Nút Xóa */}
                        <button
                          type="button"
                          disabled={isSelf || deleteMutation.isPending}
                          onClick={() => handleDelete(item)}
                          title={
                            isSelf
                              ? "Không thể xóa chính mình"
                              : "Xóa tài khoản"
                          }
                          className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <i className="fa-regular fa-trash-can" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalFiltered > 0 && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Hiển thị{" "}
            <span className="font-bold">
              {Math.min((page - 1) * PAGE_SIZE + 1, totalFiltered)}
            </span>{" "}
            -{" "}
            <span className="font-bold">
              {Math.min(page * PAGE_SIZE, totalFiltered)}
            </span>{" "}
            trong tổng số <span className="font-bold">{totalFiltered}</span> tài
            khoản
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-chevron-left mr-1" />
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                  p === page
                    ? "bg-emerald-600 text-white font-bold"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sau
              <i className="fa-solid fa-chevron-right ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {formState.open && (
        <UserFormModal
          user={formState.user}
          currentUserId={currentUser?.id}
          onClose={() => setFormState({ open: false, user: null })}
          onSaved={() =>
            queryClient.invalidateQueries({ queryKey: ["admin-users"] })
          }
        />
      )}
    </main>
  );
}

export default UserManagementPage;
