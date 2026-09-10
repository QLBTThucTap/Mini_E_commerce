import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../Stores/authStore";

function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName =
    typeof user?.name === "object"
      ? `${user.name.firstname} ${user.name.lastname}`
      : user?.name || user?.username;

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="w-full shrink-0 bg-slate-900 text-white lg:w-64">
        <div className="px-6 py-5 border-b border-slate-700">
          <p className="font-extrabold text-lg">LH TECH MART</p>
          <p className="mt-1 text-xs text-slate-400">Admin Dashboard</p>
        </div>

        <nav className="flex overflow-x-auto px-3 py-3 gap-2 lg:block lg:space-y-2">
          <NavLink
            to="/"
            className="block whitespace-nowrap rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
          >
            <i className="fa-solid fa-house mr-3" />
            Trang chủ
          </NavLink>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              [
                "block whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800",
              ].join(" ")
            }
          >
            <i className="fa-solid fa-chart-line mr-3" />
            Thống kê
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              [
                "block whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800",
              ].join(" ")
            }
          >
            <i className="fa-solid fa-file-invoice mr-3" />
            Quản lý đơn hàng
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              [
                "block whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800",
              ].join(" ")
            }
          >
            <i className="fa-solid fa-box mr-3" />
            Quản lý sản phẩm
          </NavLink>
        </nav>

        <div className="hidden border-t border-slate-700 px-6 py-5 lg:block">
          <p className="text-sm font-bold">{displayName}</p>
          <p className="text-xs text-emerald-400 uppercase mt-1">
            {user?.role}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 text-sm text-slate-300 hover:text-white"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;
