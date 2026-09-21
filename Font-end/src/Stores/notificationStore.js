// Font-end/src/Stores/notificationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let nextId = Date.now();

const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],

      // Thêm thông báo mới vào đầu danh sách
      addNotification: (notification) => {
        const newNotif = {
          id: ++nextId,
          read: false,
          createdAt: new Date().toISOString(),
          ...notification,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 30), // giữ tối đa 30
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
      name: "user-notifications",
      // Chỉ persist danh sách thông báo
      partialize: (state) => ({ notifications: state.notifications }),
    },
  ),
);

export default useNotificationStore;
