import { useAccountProfile } from "../_hooks/useAccountProfile";

export default function TabProfile() {
  const { saveSuccess, formMethods, updateMutation, onProfileSubmit } =
    useAccountProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = formMethods;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-extrabold text-slate-900 mb-5">
        Thông tin cá nhân
      </h2>

      {saveSuccess && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <i className="fa-solid fa-check-circle" />
          {saveSuccess}
        </div>
      )}

      {updateMutation.isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <i className="fa-solid fa-circle-exclamation mr-2" />
          {updateMutation.error?.response?.data?.message ||
            "Cập nhật thất bại. Vui lòng thử lại."}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onProfileSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            placeholder="VD: 0912345678"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Giới tính
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("gender")}
          >
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Ngày sinh
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("dateOfBirth")}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Tỉnh / Thành phố
          </label>
          <input
            type="text"
            placeholder="VD: Hà Nội"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("city")}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Quận / Huyện
          </label>
          <input
            type="text"
            placeholder="VD: Cầu Giấy"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("district")}
          />
        </div>

        <div className="sm:col-span-2 flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {(isSubmitting || updateMutation.isPending) && (
              <i className="fa-solid fa-spinner fa-spin" />
            )}
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
