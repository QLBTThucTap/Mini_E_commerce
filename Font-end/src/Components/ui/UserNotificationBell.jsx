// Font-end/src/Components/ui/UserNotificationBell.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useNotificationStore from "../../Stores/notificationStore";
import useAuthStore from "../../Stores/authStore";
import { getOrdersByUser } from "../../Services/orderService";

// Icon map theo loại notification
const TYPE_ICON = {
  order: { icon: "fa-solid fa-box-open", color: "text-emerald-500" },
  payment: { icon: "fa-solid fa-credit-card", color: "text-blue-500" },
  system: { icon: "fa-solid fa-bell", color: "text-amber-500" },
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

export default function UserNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const allNotifications = useNotificationStore((s) => s.notifications);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const markRead = useNotificationStore((s) => s.markRead);
  const clearAll = useNotificationStore((s) => s.clearAll);

  // Tự động đồng bộ các đơn hàng của user từ server nếu chưa có trong chuông
  const { data: userOrders } = useQuery({
    queryKey: ["user-orders-bell", user?.id],
    queryFn: () => getOrdersByUser(user.id),
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!Array.isArray(userOrders) || userOrders.length === 0) return;

    userOrders.forEach((order) => {
      const exists = allNotifications.some(
        (n) => n.orderId === order.id || n.message?.includes(`#${order.id}`),
      );
      if (!exists) {
        addNotification({
          userId: user?.id,
          orderId: order.id,
          type: "order",
          title: "Đơn hàng của bạn",
          message: `Đơn hàng #${order.id} trị giá $${Number(order.total || 0).toFixed(2)} (${order.status || "pending"})`,
          createdAt: order.createdAt || new Date().toISOString(),
          read: true, // đơn cũ đồng bộ về mặc định coi như đã biết
        });
      }
    });
  }, [userOrders, allNotifications, addNotification, user?.id]);

  // Lọc thông báo theo user hiện tại
  const notifications = useMemo(() => {
    if (!user) return [];
    return allNotifications.filter(
      (n) => !n.userId || Number(n.userId) === Number(user.id),
    );
  }, [allNotifications, user]);

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

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkRead = (id) => {
    markRead(id);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
        title="Thông báo"
      >
        <i className="fa-regular fa-bell text-sm" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-11 z-50 w-80 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-extrabold text-slate-800">
              Thông báo
              {unreadCount > 0 && (
                <span className="ml-2 bg-rose-100 text-rose-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </span>
            <div className="flex gap-2">
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
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">
                <i className="fa-regular fa-bell-slash text-2xl mb-2 block" />
                Chưa có thông báo nào
              </div>
            ) : (
              notifications.map((n) => {
                const typeInfo = TYPE_ICON[n.type] || TYPE_ICON.system;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleMarkRead(n.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition cursor-pointer ${
                      !n.read ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className="mt-0.5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0"
                    >
                      <i
                        className={`${typeInfo.icon} ${typeInfo.color} text-xs`}
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
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
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
