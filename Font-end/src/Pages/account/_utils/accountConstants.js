export const ORDER_FILTER_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xử lý" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã hủy" },
];

export const STATUS_LABELS = {
  pending: "Chờ xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  shipping: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export const STATUS_ICONS = {
  pending: "fa-solid fa-clock",
  shipping: "fa-solid fa-truck",
  delivered: "fa-solid fa-check-circle",
  cancelled: "fa-solid fa-times-circle",
};

export const TABS = [
  { key: "info", label: "Thông tin cá nhân", icon: "fa-regular fa-user" },
  { key: "orders", label: "Lịch sử đơn hàng", icon: "fa-solid fa-box-open" },
  { key: "address", label: "Địa chỉ", icon: "fa-solid fa-location-dot" },
  { key: "password", label: "Đổi mật khẩu", icon: "fa-solid fa-lock" },
];
