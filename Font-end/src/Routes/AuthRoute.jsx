import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../Stores/authStore";

/**
 * Bảo vệ các trang yêu cầu đăng nhập (dành cho user thông thường).
 * - Nếu chưa đăng nhập → chuyển hướng về /login
 * - Nếu đã đăng nhập (bất kỳ role) → cho phép vào
 */
function AuthRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      toast.warn("Yêu cầu đăng nhập để truy cập vào");
    }
  }, [isInitializing, isAuthenticated]);

  if (isInitializing) {
    return <div className="p-8 text-center text-slate-500">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

export default AuthRoute;
