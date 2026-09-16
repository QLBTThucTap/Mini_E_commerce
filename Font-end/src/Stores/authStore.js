//dùng zustand + persist để tự lưu vào localStorage
import { persist } from "zustand/middleware";
import { create } from "zustand";
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      // Gọi sau khi refresh-token thành công để cập nhật accessToken mới
      setAccessToken: (accessToken) => set({ accessToken }),
    }),

    {
      name: "authe-storage", //key lưu trong localStorage

      // Chỉ lưu những field này xuống localStorage.
      // accessToken KHÔNG được đưa vào đây -> không bao giờ nằm trong authe-storage,
      // chỉ tồn tại trong RAM (state) khi tab đang mở, mất khi F5/đóng tab.
      // Khi cần lại, interceptor trong http.js sẽ tự refresh bằng refreshToken.
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
