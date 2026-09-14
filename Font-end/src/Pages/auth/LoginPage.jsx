import { Link } from "react-router-dom";

import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import { FOOTER_BRAND, FOOTER_COLUMNS } from "../home/_constants/footer";
import Button from "../../Components/ui/Button";

import AuthBreadcrumb from "./_components/AuthBreadcrumb";
import LoginIllustration from "./_components/LoginIllustration";
import SocialAuthButtons from "./_components/SocialAuthButtons";
import { useLoginForm } from "./_hooks/useLoginForm";
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    serverError,
    showPassword,
    toggleShowPassword,
    rememberDevice,
    setRememberDevice,
    registeredName,
  } = useLoginForm();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <AuthBreadcrumb currentLabel="Authentication" />

      <main className="max-w-[1360px] mx-auto px-4 py-8 sm:py-12 flex-1 w-full flex items-center justify-center">
        <div className="w-full max-w-6xl bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Top Tab Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 px-6 sm:px-12 pt-6 pb-4 gap-4">
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 border-b-2 border-emerald-600 pb-4 -mb-[18px]">
                <i className="fa-solid fa-arrow-right-to-bracket text-emerald-600" />
                <span>Login to Account</span>
              </div>
              <Link
                to="/register"
                className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors pb-4 -mb-[18px]"
              >
                <i className="fa-regular fa-user" />
                <span>Create Account</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <i className="fa-solid fa-lock text-emerald-600 text-xs" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Main 2-Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 items-center">
            {/* Left Column: Visual Illustration */}
            <div className="lg:col-span-6 flex justify-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-8">
              <LoginIllustration />
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-6 max-w-md mx-auto w-full">
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight my-0">
                  Welcome Back
                </h1>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                  LOGIN TO CONTINUE
                </div>
              </div>

              {registeredName && !serverError && (
                <div className="mb-5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-sm" />
                  <span>
                    Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp
                    tục.
                  </span>
                </div>
              )}

              {serverError && (
                <div className="mb-5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                  <i className="fa-solid fa-circle-exclamation text-red-500 text-sm mt-0.5 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Alex"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-2xs"
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.name?.message}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Password
                    </label>
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(
                          "Vui lòng liên hệ hotline (025) 3686 25 16 để đặt lại mật khẩu.",
                        );
                      }}
                      className="text-xs text-slate-400 hover:text-emerald-600 font-medium transition-colors"
                    >
                      Forgot Password ?
                    </a>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="•••••••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-2xs"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      tabIndex={-1}
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      <i
                        className={
                          showPassword
                            ? "fa-regular fa-eye text-sm"
                            : "fa-regular fa-eye-slash text-sm"
                        }
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Remember Device Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="rememberDevice"
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label
                    htmlFor="rememberDevice"
                    className="text-xs text-slate-600 select-none cursor-pointer font-medium"
                  >
                    Remember this device for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                    className="w-full py-3 text-sm font-bold uppercase tracking-wider shadow-sm"
                  >
                    LOGIN
                  </Button>
                </div>
              </form>

              {/* Social Login Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative inline-block bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  OR CONTINUE WITH
                </div>
              </div>

              {/* Social Buttons */}
              <SocialAuthButtons />

              {/* New User Link */}
              <div className="text-center text-xs text-slate-500 mt-6 pt-2">
                <span>NEW USER ?</span>{" "}
                <Link
                  to="/register"
                  className="font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wide hover:underline ml-1"
                >
                  SIGN UP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
