// Font-end/src/Stores/authStore.js
import { persist } from "zustand/middleware";
import { create } from "zustand";
import Instance from "../Services/http";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitializing: true, // Cờ kiểm tra đang khôi phục đăng nhập

      login: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isInitializing: false,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isInitializing: false,
        }),

      setAccessToken: (accessToken) => set({ accessToken }),

      // Tự động khôi phục thông tin user khi F5
      initializeAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          set({ isInitializing: false, isAuthenticated: false, user: null });
          return;
        }

        try {
          // Interceptor của Instance sẽ tự dùng refreshToken để lấy accessToken mới
          const res = await Instance.get("auth/me");
          set({
            user: res.data,
            isAuthenticated: true,
            isInitializing: false,
          });
        } catch (error) {
          // Refresh token hết hạn hoặc không hợp lệ -> đăng xuất sạch
          get(error).logout();
        }
      },
    }),
    {
      name: "authe-storage",
      // CHỈ LƯU DUY NHẤT refreshToken, KHÔNG lưu user hay bất kỳ thông tin nào khác
      partialize: (state) => ({
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

export default useAuthStore;
