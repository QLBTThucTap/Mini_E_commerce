import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Instance from "../../Services/http";

const schema = z
  .object({
    name: z.string().trim().min(2, {
      message: "Tên phải từ 2 ký tự trở lên",
    }),
    gender: z.enum(["Male", "Female", "Other"], {
      error: () => ({ message: "Chọn giới tính" }),
    }),

    dateOfBirth: z.union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Vui lòng chọn ngày sinh",
      }),
      z.date(),
    ]),

    phoneNumber: z
      .string()
      .trim()
      .regex(/^0(3|5|7|8|9)[0-9]{8}$/, {
        message: "Số điện thoại không hợp lệ (VD: 0912345678)",
      }),
    email: z
      .string()
      .trim()
      .min(1, {
        message: "Email bắt buộc phải nhập",
      })
      .pipe(
        z.email({
          message: "Email phải đúng định dạng",
        }),
      )
      .refine(
        async (value) => {
          return !value.includes("admin");
        },
        {
          message: "Email không được nhập là admin",
        },
      ),

    address: z.object({
      city: z.string().trim().min(1, { message: "Nhập thành phố" }),
      district: z.string().trim().min(1, { message: "Nhập quận" }),
    }),
    password: z.string().trim().min(6, {
      message: "Mật khẩu phải từ 6 ký tự trở lên",
    }),

    confirm_password: z.string(),
  })
  .superRefine(({ password, confirm_password }, context) => {
    if (password !== confirm_password) {
      context.addIssue({
        code: "custom",
        message: "Confirm password không khớp!",
        path: ["confirm_password"],
      });
    }
  });

function RegisterPage() {
  const navigate = useNavigate();
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
      await Instance.post("users", {
        email: data.email,
        username: data.username,
        password: data.password,
        name: data.name,
        phone: data.phoneNumber,
        address: {
          city: data.address.city,
          district: data.address.district,
        },
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
      });

      navigate("/login", {
        state: { registeredEmail: data.email },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.";
      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Đăng ký tài khoản
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tạo tài khoản để mua sắm tại LH TECH MART
          </p>
        </div>

        {serverError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {/* Thông tin cá nhân */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-emerald-700 uppercase tracking-wide mb-1">
              Thông tin cá nhân
            </legend>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="VD: nguyenvanan95"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("username")}
                />
                {errors.username && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Giới tính
                </label>
                <select
                  id="gender"
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("gender")}
                >
                  <option value="" disabled>
                    Chọn giới tính
                  </option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
                {errors.gender && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.gender.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Ngày sinh
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.dateOfBirth.message}
                  </span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="VD: 0912345678"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Địa chỉ */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-emerald-700 uppercase tracking-wide mb-1">
              Địa chỉ
            </legend>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Thành phố
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Nhập thành phố"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("address.city")}
                />
                {errors.address?.city && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.address.city.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Quận/Huyện
                </label>
                <input
                  id="district"
                  type="text"
                  placeholder="Nhập quận/huyện"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("address.district")}
                />
                {errors.address?.district && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.address.district.message}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Bảo mật */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-emerald-700 uppercase tracking-wide mb-1">
              Thông tin đăng nhập
            </legend>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Nhập email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.email?.message}
                  </span>
                )}
              </div>

              <div />

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
                  placeholder="Từ 6 ký tự trở lên"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Nhập lại mật khẩu
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.confirm_password.message}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 transition-colors"
          >
            {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
