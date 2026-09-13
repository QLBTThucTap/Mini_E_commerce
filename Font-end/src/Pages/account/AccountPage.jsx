import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import { FOOTER_BRAND, FOOTER_COLUMNS } from "../home/_constants/footer";
import useAuthStore from "../../Stores/authStore";

import AccountHeader from "./_components/AccountHeader";
import AccountSidebar from "./_components/AccountSidebar";
import TabProfile from "./_components/TabProfile";
import TabOrders from "./_components/TabOrders";
import TabAddress from "./_components/TabAddress";
import TabPassword from "./_components/TabPassword";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab =
    searchParams.get("tab") || location.state?.tab || "password";
  const setActiveTab = (tabKey) => setSearchParams({ tab: tabKey });

  const displayName =
    user?.fullName ||
    (typeof user?.name === "string"
      ? user.name
      : typeof user?.name === "object"
        ? `${user.name?.firstname || ""} ${user.name?.lastname || ""}`.trim()
        : user?.username || "Người dùng");

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F4F6F8]">
        <main className="max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-8">
          {/* Card trắng lớn bọc ngoài toàn bộ giao diện */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* CỘT TRÁI (4 CỘT - Khoảng 33% độ rộng): Bọc chung Avatar + Navigation */}
              <div className="lg:col-span-4 w-full">
                <AccountHeader
                  displayName={displayName}
                  email={user?.email}
                  avatar={user?.avatar}
                />
                <AccountSidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>

              {/* CỘT PHẢI (8 CỘT - Khoảng 67% độ rộng): Nội dung chính */}
              <div className="lg:col-span-8 w-full min-w-0">
                {activeTab === "info" && <TabProfile />}
                {activeTab === "orders" && <TabOrders activeTab={activeTab} />}
                {activeTab === "address" && <TabAddress />}
                {activeTab === "password" && <TabPassword />}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </>
  );
}
