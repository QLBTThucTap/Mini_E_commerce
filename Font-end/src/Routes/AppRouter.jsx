import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../Pages/home/HomePage";
import LoginPage from "../Pages/auth/LoginPage";
import RegisterPage from "../Pages/auth/RegisterPage";
import ProductDetailPage from "../Pages/products/ProductDetailPage";
import CartPage from "../Pages/cart/CartPage";
import CheckoutPage from "../Pages/checkout/CheckoutPage";

import AdminRoute from "./AdminRoute";
import AuthRoute from "./AuthRoute";
import AdminLayout from "../Layouts/AdminLayout";
import ProductManagementPage from "../Pages/admin/products/ProductManagementPage";
import DashboardPage from "../Pages/admin/dashboard/DashboardPage";
import OrderManagementPage from "../Pages/admin/orders/OrderManagementPage";
import UserManagementPage from "../Pages/admin/users/UserManagementPage";
import AccountPage from "../Pages/account/AccountPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Trang tài khoản cá nhân — yêu cầu đăng nhập */}
      <Route element={<AuthRoute />}>
        <Route path="/account" element={<AccountPage />} />
      </Route>

      {/* Trang admin — yêu cầu role admin */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/orders" element={<OrderManagementPage />} />
          <Route path="/admin/products" element={<ProductManagementPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;

