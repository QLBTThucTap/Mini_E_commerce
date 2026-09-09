import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../Stores/authStore";

function AdminRoute() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }} // Lưu lại đường dẫn người dùng định vào (ví dụ: /admin/products). Sau khi đăng nhập thành công, có thể redirect họ quay lại trang này
        replace //Thay thế trang hiện tại trong lịch sử trình duyệt (không cho phép bấm nút Back để quay lại trang admin)
      ></Navigate>
    );
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet></Outlet>;
}

export default AdminRoute;
