// Font-end/src/Components/ui/AdminNotificationBell.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAdminNotificationStore from "../../Stores/adminNotificationStore";
import useAuthStore from "../../Stores/authStore";
import { getAllOrders } from "../../Services/orderService";

// Icon map theo loại notification admin
const TYPE_ICON = {
  product: {
    icon: "fa-solid fa-box",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  order: {
    icon: "fa-solid fa-file-invoice",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  user: {
    icon: "fa-solid fa-user-plus",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  system: {
    icon: "fa-solid fa-gear",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
};

function timeAgo(isoString) {
  if (!isoString) return "Vừa xong";
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export default function AdminNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const notifications = useAdminNotificationStore((s) => s.notifications);
  const addNotification = useAdminNotificationStore((s) => s.addNotification);
  const markAllRead = useAdminNotificationStore((s) => s.markAllRead);
  const markRead = useAdminNotificationStore((s) => s.markRead);
  const clearAll = useAdminNotificationStore((s) => s.clearAll);

  // Tự động kiểm tra đơn hàng mới từ database backend mỗi 10 giây khi là admin
  const { data: serverOrders } = useQuery({
    queryKey: ["admin-orders-bell"],
    queryFn: getAllOrders,
    enabled: user?.role === "admin",
    refetchInterval: 10000,
    staleTime: 5000,
  });

  useEffect(() => {
    if (!Array.isArray(serverOrders) || serverOrders.length === 0) return;

    // Lọc và duyệt các đơn hàng gần đây (đặc biệt là đơn pending hoặc mới)
    serverOrders.forEach((order) => {
      const exists = notifications.some(
        (n) => n.orderId === order.id || n.message?.includes(`#${order.id}`),
      );
      if (!exists) {
        const customerName =
          order.shippingInfo?.fullName ||
          order.shippingInfo?.firstName ||
          (order.userId ? `User #${order.userId}` : "Khách hàng");
        addNotification({
          type: "order",
          orderId: order.id,
          title: "Đơn hàng mới",
          message: `Khách hàng ${customerName} vừa đặt đơn #${order.id} ($${Number(order.total || 0).toFixed(2)})`,
          createdAt: order.createdAt || new Date().toISOString(),
          read: false,
        });
      }
    });
  }, [serverOrders, notifications, addNotification]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer text-slate-700"
        title="Thông báo quản trị"
      >
        <i className="fa-regular fa-bell text-sm" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold leading-none shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-sm font-extrabold text-slate-800">
              Thông báo Admin
              {unreadCount > 0 && (
                <span className="ml-2 bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </span>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-emerald-600 hover:underline font-semibold"
                >
                  Đọc tất cả
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-slate-400 hover:text-red-500 font-semibold"
                >
                  Xóa hết
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                <i className="fa-regular fa-bell-slash text-3xl mb-2 block" />
                Chưa có thông báo
              </div>
            ) : (
              notifications.map((n) => {
                const typeInfo = TYPE_ICON[n.type] || TYPE_ICON.system;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition cursor-pointer ${
                      !n.read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 w-9 h-9 rounded-xl ${typeInfo.bg} flex items-center justify-center shrink-0`}
                    >
                      <i
                        className={`${typeInfo.icon} ${typeInfo.color} text-sm`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
