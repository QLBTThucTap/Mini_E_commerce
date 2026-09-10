import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, updateUser } from "../../../../Services/userService";
import { createUserSchema, updateUserSchema } from "../_schema/userSchema";

const defaultValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  role: "user",
  gender: "Other",
  dateOfBirth: "",
  city: "",
  district: "",
  isLocked: false,
};

function UserFormModal({ user, currentUserId, onClose, onSaved }) {
  const [serverError, setServerError] = useState("");
  const isEditing = Boolean(user);
  const isEditingSelf = Boolean(user && Number(user.id) === Number(currentUserId));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user) {
      const city =
        typeof user.address === "object" ? user.address?.city || "" : "";
      const district =
        typeof user.address === "object" ? user.address?.district || "" : "";

      const fullName =
        user.fullName ||
        (typeof user.name === "string"
          ? user.name
          : typeof user.name === "object"
            ? `${user.name.firstname || ""} ${user.name.lastname || ""}`.trim()
            : user.username || "");

      reset({
        fullName,
        email: user.email || "",
        phoneNumber: user.phoneNumber || user.phone || "",
        password: "",
        role: user.role === "admin" ? "admin" : "user",
        gender: ["Male", "Female", "Other"].includes(user.gender)
          ? user.gender
          : "Other",
        dateOfBirth: user.dateOfBirth || "",
        city,
        district,
        isLocked: Boolean(user.isLocked),
      });
    } else {
      reset(defaultValues);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const payload = {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber?.trim() || "",
        role: data.role,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth || "",
        address: {
          city: data.city?.trim() || "",
          district: data.district?.trim() || "",
        },
        isLocked: data.isLocked,
      };

      if (data.password && data.password.trim().length > 0) {
        payload.password = data.password.trim();
      }

      if (isEditing) {
        await updateUser(user.id, payload);
      } else {
        await createUser(payload);
      }

      await onSaved();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (isEditing
          ? "Không thể cập nhật tài khoản. Vui lòng thử lại."
          : "Không thể tạo tài khoản. Vui lòng thử lại.");
      setServerError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isEditing ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {isEditing
                ? `Cập nhật thông tin tài khoản #${user.id}`
                : "Điền thông tin bên dưới để tạo tài khoản mới"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {serverError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <i className="fa-solid fa-circle-exclamation mr-2" />
            {serverError}
          </div>
        )}

        {isEditingSelf && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <i className="fa-solid fa-triangle-exclamation mr-1.5" />
            Bạn đang chỉnh sửa tài khoản của chính mình. Quyền admin và trạng thái khóa không thể thay đổi tại đây để đảm bảo an toàn.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Họ và tên */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="VD: email@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mật khẩu{" "}
                {!isEditing ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-slate-400 font-normal lowercase">
                    (để trống nếu không đổi)
                  </span>
                )}
              </label>
              <input
                type="password"
                placeholder={
                  isEditing
                    ? "Nhập nếu muốn đổi mật khẩu mới"
                    : "Mật khẩu tối thiểu 6 ký tự"
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                placeholder="VD: 0912345678"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Vai trò */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                disabled={isEditingSelf}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                {...register("role")}
              >
                <option value="user">Người dùng (user)</option>
                <option value="admin">Quản trị viên (admin)</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Trạng thái tài khoản */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Trạng thái tài khoản
              </label>
              <select
                disabled={isEditingSelf}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                {...register("isLocked", {
                  setValueAs: (v) => v === "true" || v === true,
                })}
              >
                <option value="false">Hoạt động</option>
                <option value="true">Đã khóa</option>
              </select>
              {errors.isLocked && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.isLocked.message}
                </p>
              )}
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Giới tính
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...register("gender")}
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...register("dateOfBirth")}
              />
            </div>

            {/* Tỉnh / Thành phố */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tỉnh / Thành phố
              </label>
              <input
                type="text"
                placeholder="VD: Hà Nội, TP.HCM"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...register("city")}
              />
            </div>

            {/* Quận / Huyện */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Quận / Huyện
              </label>
              <input
                type="text"
                placeholder="VD: Cầu Giấy, Quận 1"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...register("district")}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <i className="fa-solid fa-spinner fa-spin" />}
              {isEditing ? "Lưu thay đổi" : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;
