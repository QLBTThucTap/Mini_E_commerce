import { Navigate, Outlet, useLocation } from "react-router-dom";
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

  if (isInitializing) {
    return <div className="p-8 text-center text-slate-500">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

export default AuthRoute;
