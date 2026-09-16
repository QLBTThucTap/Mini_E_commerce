import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../Stores/authStore";

/**
 * Bảo vệ các trang chỉ dành cho khách chưa đăng nhập (login/register).
 * - Nếu ĐÃ đăng nhập -> không cho vào lại /login, /register nữa,
 *   tự động điều hướng: admin -> /admin/dashboard, user thường -> /
 * - Nếu chưa đăng nhập -> cho vào bình thường
 */

function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const user = useAuthStore((state) => state.user);

  // Đang khôi phục phiên đăng nhập thì tạm thời chưa điều hướng
  if (isInitializing) {
    return <div className="p-8 text-center text-slate-500">Đang tải...</div>;
  }
  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/"}
        replace
      />
    );
  }

  return <Outlet />;
}

export default GuestRoute;
