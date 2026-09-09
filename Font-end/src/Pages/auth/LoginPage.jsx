import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../Stores/authStore";
import Instance from "../../Services/http";
const schema = z.object({
  // email: z
  //   .string()
  //   .trim()
  //   .min(1, {
  //     message: "Email bắt buộc phải nhập",
  //   })
  //   .pipe(
  //     z.email({
  //       message: "Email phải đúng định dạng",
  //     }),
  //   )
  //   .refine(
  //     async (value) => {
  //       return !value.includes("admin");
  //     },
  //     {
  //       message: "Email không được nhập là admin",
  //     },
  //   ),

  name: z.string().trim().min(2, {
    message: "Tên người bắt buộc phải nhập",
  }),
  password: z.string().trim().min(6, {
    message: "Mật khẩu phải từ 6 ký tự trở lên",
  }),
});

// const delay = (value) => {
//   return new Promise((resolve) => setTimeout(resolve, value));
// };

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const response = await Instance.post("auth/login", {
        // email: data.email,
        name: data.name,
        password: data.password,
      });
      const result = await response.data;
      login({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      if (result.accessToken) {
        localStorage.getItem("access_token", result.accessToken);
      }

      navigate(result.user.role === "admin" ? "/admin/products" : "/"); // tự động quay về home
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.";
      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Đăng nhập</h1>
          <p className="text-sm text-slate-500 mt-1">
            Chào mừng bạn quay lại LH TECH MART
          </p>
        </div>

        {serverError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nhập tên đăng nhập"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              {...register("name")}
            />
            {errors.name && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.name?.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              {...register("password")}
            />
            {errors.password && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 transition-colors"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
