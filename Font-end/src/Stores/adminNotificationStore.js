// Font-end/src/Stores/adminNotificationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let nextId = Date.now() + 1;

const useAdminNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],

      // Thêm thông báo admin mới vào đầu danh sách
      addNotification: (notification) => {
        const newNotif = {
          id: ++nextId,
          read: false,
          createdAt: new Date().toISOString(),
          ...notification,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 50), // giữ tối đa 50
        }));
      },

      // Đánh dấu một thông báo đã đọc
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      // Đánh dấu tất cả đã đọc
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Xóa tất cả thông báo
      clearAll: () => set({ notifications: [] }),

      // Số lượng chưa đọc
      get unreadCount() {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: "admin-notifications",
      partialize: (state) => ({ notifications: state.notifications }),
    },
  ),
);

export default useAdminNotificationStore;
