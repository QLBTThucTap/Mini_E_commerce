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
    }),
    {
      name: "authe-storage", //key lưu trong localStorage
    },
  ),
);

export default useAuthStore;
