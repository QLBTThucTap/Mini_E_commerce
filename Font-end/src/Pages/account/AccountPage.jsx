import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import useAuthStore from "../../Stores/authStore";
import { updateUser } from "../../Services/userService";
import { getOrdersByUser } from "../../Services/orderService";
import { getProducts } from "../../Services/productService";
import Header from "../../Layouts/Header";

// ─── Schemas ───────────────────────────────────────────────────────────────
const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  email: z.string().trim().email({ message: "Email không đúng định dạng" }),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^(0[3|5|7|8|9][0-9]{8})?$/, {
      message: "Số điện thoại không hợp lệ (VD: 0912345678)",
    })
    .optional()
    .or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
});

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, { message: "Mật khẩu mới phải từ 6 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// ─── Helpers ───────────────────────────────────────────────────────────────
const STATUS_LABELS = {
  pending: "Chờ xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  shipping: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_ICONS = {
  pending: "fa-solid fa-clock",
  shipping: "fa-solid fa-truck",
  delivered: "fa-solid fa-check-circle",
  cancelled: "fa-solid fa-times-circle",
};

function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(val) {
  return `$${Number(val || 0).toFixed(2)}`;
}

// ─── Tab navigation ────────────────────────────────────────────────────────
const TABS = [
  { key: "info", label: "Thông tin cá nhân", icon: "fa-regular fa-user" },
  { key: "orders", label: "Lịch sử đơn hàng", icon: "fa-solid fa-box-open" },
  { key: "password", label: "Đổi mật khẩu", icon: "fa-solid fa-lock" },
];

// ─── Main Component ────────────────────────────────────────────────────────
export default function AccountPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const loginAction = useAuthStore((state) => state.login);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || location.state?.tab || "info";
  const setActiveTab = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };
  const [saveSuccess, setSaveSuccess] = useState("");

  // Lấy họ tên hiển thị linh hoạt
  const displayName =
    user?.fullName ||
    (typeof user?.name === "string"
      ? user.name
      : typeof user?.name === "object"
        ? `${user.name?.firstname || ""} ${user.name?.lastname || ""}`.trim()
        : user?.username || "Người dùng");

  // ─── Profile Form ───────────────────────────────────────────────────────
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: savingProfile },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: displayName,
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || user?.phone || "",
      gender: ["Male", "Female", "Other"].includes(user?.gender)
        ? user.gender
        : "Other",
      dateOfBirth: user?.dateOfBirth || "",
      city: typeof user?.address === "object" ? user.address?.city || "" : "",
      district:
        typeof user?.address === "object" ? user.address?.district || "" : "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(user.id, data),
    onSuccess: (updated) => {
      // Đồng bộ lại store để header hiển thị tên mới ngay lập tức
      loginAction({ user: { ...user, ...updated }, accessToken, refreshToken });
      setSaveSuccess("Cập nhật thông tin thành công!");
      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
      setTimeout(() => setSaveSuccess(""), 3000);
    },
  });

  const onProfileSubmit = (data) => {
    updateMutation.mutate({
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber?.trim() || "",
      gender: data.gender,
      dateOfBirth: data.dateOfBirth || "",
      address: {
        city: data.city?.trim() || "",
        district: data.district?.trim() || "",
      },
    });
  };

  // ─── Password Form ──────────────────────────────────────────────────────
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: savingPw },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const passwordMutation = useMutation({
    mutationFn: (data) => updateUser(user.id, { password: data.newPassword }),
    onSuccess: () => {
      setPwSuccess("Đổi mật khẩu thành công!");
      setPwError("");
      resetPw();
      setTimeout(() => setPwSuccess(""), 3000);
    },
    onError: (err) => {
      setPwError(
        err.response?.data?.message || "Đổi mật khẩu thất bại. Thử lại.",
      );
    },
  });

  const onPasswordSubmit = (data) => passwordMutation.mutate(data);

  // ─── Orders ─────────────────────────────────────────────────────────────
  const {
    data: orders,
    isLoading: loadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: () => getOrdersByUser(user.id),
    enabled: activeTab === "orders" && Boolean(user?.id),
  });

  const { data: productData } = useQuery({
    queryKey: ["account-products-map"],
    queryFn: () => getProducts({ page: 1, pageSize: 1000 }),
    enabled: activeTab === "orders",
  });

  const productMap = new Map((productData?.items ?? []).map((p) => [p.id, p]));

  const sortedOrders = [...(orders ?? [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* ── Header Card ───────────────────────────────────────────── */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-700" />
            <div className="px-6 pb-6 flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-extrabold text-emerald-600 bg-emerald-50">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="sm:mb-1">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {displayName}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
              </div>
              <div className="sm:ml-auto sm:mb-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                  <i className="fa-regular fa-user text-[10px]" />
                  User
                </span>
              </div>
            </div>
          </div>

          {/* ── Tabs + Content ────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar tabs */}
            <aside className="lg:w-56 shrink-0">
              <nav className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-left transition-colors border-b border-slate-100 last:border-0 ${
                      activeTab === tab.key
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <i className={`${tab.icon} w-4 text-center`} />
                    {tab.label}
                  </button>
                ))}

                <div className="border-t border-slate-100 px-4 py-3">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700"
                  >
                    <i className="fa-solid fa-arrow-left text-xs" />
                    Về trang chủ
                  </Link>
                </div>
              </nav>
            </aside>

            {/* Tab panels */}
            <div className="flex-1 min-w-0">
              {/* ═══ TAB: Thông tin cá nhân ═══════════════════════════ */}
              {activeTab === "info" && (
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
                    onSubmit={handleProfile(onProfileSubmit)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {/* Họ và tên */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regProfile("fullName")}
                      />
                      {profileErrors.fullName && (
                        <p className="mt-1 text-xs text-red-600">
                          {profileErrors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regProfile("email")}
                      />
                      {profileErrors.email && (
                        <p className="mt-1 text-xs text-red-600">
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        placeholder="VD: 0912345678"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regProfile("phoneNumber")}
                      />
                      {profileErrors.phoneNumber && (
                        <p className="mt-1 text-xs text-red-600">
                          {profileErrors.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Giới tính */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Giới tính
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regProfile("gender")}
                      >
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regProfile("dateOfBirth")}
                      />
                    </div>

                    {/* Tỉnh / Thành phố */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Tỉnh / Thành phố
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Hà Nội"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regProfile("city")}
                      />
                    </div>

                    {/* Quận / Huyện */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Quận / Huyện
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Cầu Giấy"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regProfile("district")}
                      />
                    </div>

                    {/* Submit */}
                    <div className="sm:col-span-2 flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={savingProfile || updateMutation.isPending}
                        className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                      >
                        {(savingProfile || updateMutation.isPending) && (
                          <i className="fa-solid fa-spinner fa-spin" />
                        )}
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ═══ TAB: Lịch sử đơn hàng ════════════════════════════ */}
              {activeTab === "orders" && (
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-extrabold text-slate-900 mb-5">
                    Lịch sử đơn hàng
                  </h2>

                  {loadingOrders && (
                    <div className="py-12 text-center text-slate-500">
                      <i className="fa-solid fa-spinner fa-spin text-2xl text-emerald-400 mb-3 block" />
                      Đang tải đơn hàng...
                    </div>
                  )}

                  {ordersError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <i className="fa-solid fa-circle-exclamation mr-2" />
                      Không thể tải lịch sử đơn hàng. Vui lòng thử lại.
                    </div>
                  )}

                  {!loadingOrders &&
                    !ordersError &&
                    sortedOrders.length === 0 && (
                      <div className="py-16 text-center">
                        <i className="fa-solid fa-box-open text-4xl text-slate-200 mb-3 block" />
                        <p className="text-slate-500 font-medium">
                          Bạn chưa có đơn hàng nào.
                        </p>
                        <Link
                          to="/"
                          className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                        >
                          Mua sắm ngay
                        </Link>
                      </div>
                    )}

                  {!loadingOrders && sortedOrders.length > 0 && (
                    <div className="space-y-4">
                      {sortedOrders.map((order, idx) => {
                        const status = order.status || "pending";
                        const statusStyle =
                          STATUS_STYLES[status] || STATUS_STYLES.pending;
                        const statusIcon =
                          STATUS_ICONS[status] || "fa-solid fa-circle";

                        return (
                          <div
                            key={order.id || idx}
                            className="rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                          >
                            {/* Order header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-extrabold text-slate-800">
                                  Đơn hàng #{order.id}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyle}`}
                                >
                                  <i className={`${statusIcon} text-[10px]`} />
                                  {STATUS_LABELS[status] || status}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 font-medium">
                                <i className="fa-regular fa-clock mr-1" />
                                {formatDate(order.createdAt)}
                              </div>
                            </div>

                            {/* Products list */}
                            <div className="divide-y divide-slate-100">
                              {(order.products || []).map((item, idx) => {
                                const product = productMap.get(
                                  Number(item.productId),
                                );
                                const title =
                                  item.title ||
                                  product?.title ||
                                  `Sản phẩm #${item.productId}`;
                                const image = item.image || product?.image;
                                const price = item.price ?? product?.price;

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 px-4 py-3"
                                  >
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={title}
                                        className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-slate-50 shrink-0"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 rounded-lg border border-slate-100 bg-slate-100 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-image text-slate-300 text-lg" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-slate-800 truncate">
                                        {title}
                                      </p>
                                      <p className="text-xs text-slate-400 mt-0.5">
                                        Số lượng: {item.quantity}
                                        {price !== undefined && (
                                          <span className="ml-2 text-slate-500">
                                            · {formatCurrency(price)}
                                            /cái
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                    {price !== undefined && (
                                      <p className="text-sm font-bold text-slate-800 shrink-0">
                                        {formatCurrency(price * item.quantity)}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Order footer */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
                              <div className="text-xs text-slate-500">
                                <i className="fa-solid fa-location-dot mr-1.5" />
                                {order.shippingInfo?.address || "—"}
                                {order.shippingInfo?.fullName && (
                                  <span className="ml-2">
                                    · {order.shippingInfo.fullName}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 uppercase font-semibold">
                                  Tổng:
                                </span>
                                <span className="text-base font-extrabold text-emerald-600">
                                  {formatCurrency(order.total)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ═══ TAB: Đổi mật khẩu ════════════════════════════════ */}
              {activeTab === "password" && (
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
                    onSubmit={handlePw(onPasswordSubmit)}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Mật khẩu mới <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regPw("newPassword")}
                      />
                      {pwErrors.newPassword && (
                        <p className="mt-1 text-xs text-red-600">
                          {pwErrors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Xác nhận mật khẩu{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...regPw("confirmPassword")}
                      />
                      {pwErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">
                          {pwErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingPw || passwordMutation.isPending}
                        className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                      >
                        {(savingPw || passwordMutation.isPending) && (
                          <i className="fa-solid fa-spinner fa-spin" />
                        )}
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
