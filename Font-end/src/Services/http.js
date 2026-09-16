import axios from "axios";
import useAuthStore from "../Stores/authStore";

export const Instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your_token_here",
  },
});

Instance.interceptors.request.use((request) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete request.headers.Authorization;
  }

  return request;
});

// Các endpoint auth không nên tự trigger refresh (tránh loop vô hạn)
const AUTH_ENDPOINTS = ["auth/login", "auth/register", "auth/refresh-token"];

let isRefreshing = false;
let pendingQueue = []; // các request đang chờ token mới: { resolve, reject }

function processQueue(error, newAccessToken) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newAccessToken);
  });
  pendingQueue = [];
}

Instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) =>
      originalRequest?.url?.includes(path),
    );

    // Chỉ can thiệp khi lỗi 401, request chưa từng được retry, và không phải chính endpoint auth
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const { refreshToken, logout, setAccessToken } = useAuthStore.getState();

      // Không có refresh token (chưa đăng nhập) -> đăng xuất luôn, không cố refresh
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // Đã có 1 request khác đang refresh -> xếp hàng chờ token mới rồi gọi lại
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Instance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // Dùng axios "trần" (không qua Instance) để tránh việc chính call này bị interceptor xử lý lại
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}auth/refresh-token`,
          { refreshToken },
        );

        const newAccessToken = data.newAccessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Instance(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (refresh token cũng hết hạn) -> đăng xuất
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      console.error(
        "Lỗi từ server: ",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("Không nhận được phản hồi từ server:", error.request);
    } else {
      console.error("Lỗi khi thiết lập request:", error.message);
    }
    return Promise.reject(error);
  },
);

export default Instance;
