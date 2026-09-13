import { useAccountPassword } from "../_hooks/useAccountPassword";

export default function TabPassword() {
  const {
    pwSuccess,
    pwError,
    formMethods,
    passwordMutation,
    onPasswordSubmit,
  } = useAccountPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = formMethods;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-extrabold text-slate-900 mb-2">
        Đổi mật khẩu
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Nhập mật khẩu mới để bảo mật tài khoản của bạn.
      </p>

      {pwSuccess && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <i className="fa-solid fa-check-circle" />
          {pwSuccess}
        </div>
      )}

      {pwError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <i className="fa-solid fa-circle-exclamation mr-2" />
          {pwError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onPasswordSubmit)}
        className="space-y-4 w-full"
      >
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || passwordMutation.isPending}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {(isSubmitting || passwordMutation.isPending) && (
              <i className="fa-solid fa-spinner fa-spin" />
            )}
            Cập nhật mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
}
