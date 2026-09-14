import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import HomePage from "../Pages/home/HomePage";
import ProductListPage from "../Pages/products/ProductListPage";
import LoginPage from "../Pages/auth/LoginPage";
import RegisterPage from "../Pages/auth/RegisterPage";
import ProductDetailPage from "../Pages/products/ProductDetailPage";
import CartPage from "../Pages/cart/CartPage";
import CheckoutPage from "../Pages/checkout/CheckoutPage";
import WishlistPage from "../Pages/wishlist/WishlistPage";
import ContactPage from "../Pages/contact/ContactPage";
import AboutPage from "../Pages/about/AboutPage";

import AdminRoute from "./AdminRoute";
import AuthRoute from "./AuthRoute";
import AdminLayout from "../Layouts/AdminLayout";
import ProductManagementPage from "../Pages/admin/products/ProductManagementPage";

import OrderManagementPage from "../Pages/admin/orders/OrderManagementPage";
import UserManagementPage from "../Pages/admin/users/UserManagementPage";
import AccountPage from "../Pages/account/AccountPage";

const DashboardPage = lazy(
  () => import("../Pages/admin/dashboard/DashboardPage"),
);
function PageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="text-gray-500">Đang tải...</span>
    </div>
  );
}
function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

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
    </Suspense>
  );
}

export default AppRouter;
