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

Instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
