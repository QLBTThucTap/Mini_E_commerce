import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import useCartStore from "../../Stores/cartStore";
import useAuthStore from "../../Stores/authStore";
import { createOrder } from "../../Services/orderService";

const FOOTER_BRAND = {
  name: "LH - 1ST NYC TECH ONLINE MARKET",
  hotline: "0824781531",
  address: "273 phố Bạch Mai, quận Hai Bà Trưng, Hà Nội",
  email: "contact@swootechmart.com",
};

const FOOTER_COLUMNS = [
  {
    title: "Top Categories",
    links: [
      { label: "Laptops", href: "#laptops" },
      { label: "PC & Computers", href: "#pc" },
      { label: "Cell Phones", href: "#phones" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About me", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Help Center",
    links: [
      { label: "Customer Service", href: "#service" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    title: "Partner",
    links: [
      { label: "Become a Seller", href: "#become-seller" },
      { label: "Affiliate Program", href: "#affiliate" },
      { label: "Wholesale", href: "#wholesale" },
    ],
  },
];

const BANK_INFO = {
  bankId: "970422",
  bankName: "MB Bank (Ngân hàng Quân đội)",
  accountNumber: "08018536368888",
  accountName: "LA NGOC HUYEN",
};

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Stores
  const items = useCartStore((state) => state.items);
  const cleanCart = useCartStore((state) => state.cleanCart);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Form State
  const rawFullName =
    user?.fullName || (typeof user?.name === "string" ? user.name : "");
  const initialFirstName = rawFullName
    ? rawFullName.trim().includes(" ")
      ? rawFullName.trim().split(" ")[0]
      : rawFullName.trim()
    : user?.name && typeof user.name === "object"
      ? user.name.firstname
      : "";

  const initialLastName = rawFullName
    ? rawFullName.trim().includes(" ")
      ? rawFullName.trim().split(" ").slice(1).join(" ")
      : rawFullName.trim()
    : user?.name && typeof user.name === "object"
      ? user.name.lastname
      : "";

  const [formData, setFormData] = useState({
    firstName: initialFirstName || "",
    lastName: initialLastName || "",
    company: "",
    country: "VN",
    streetAddress: user?.address?.street
      ? `${user.address.number || ""} ${user.address.street}`.trim()
      : typeof user?.address === "string"
        ? user.address
        : "",
    apartment: "",
    city: user?.address?.city || user?.city || "",
    state: user?.district || "Hà Nội",
    zipCode: user?.address?.zipcode || "100000",
    phone: user?.phone || user?.phoneNumber || "",
    email: user?.email || "",
    orderNotes: "",
    saveInfo: true,
  });

  // UI accordion toggles
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState({ text: "", type: "" });

  // Payment method: "bank" (QR) | "cod" | "paypal"
  const [paymentMethod, setPaymentMethod] = useState("bank");

  // Submission & modal states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [errors, setErrors] = useState({});

  // Calculations
  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const rawShipping = subTotal >= 199 || subTotal === 0 ? 0 : 9.5;
  const isFreeShipping = subTotal >= 199 && subTotal > 0;
  const discountAmount = subTotal * appliedDiscount;
  const grandTotal = Math.max(0, subTotal - discountAmount + rawShipping);
  const grandTotalVND = Math.round(grandTotal * 25400);

  // Copy helper
  const copyToClipboard = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    }
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle Apply Coupon
  const handleApplyVoucher = (e) => {
    e.preventDefault();
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    if (code === "SWOO10" || code === "TECH10") {
      setAppliedDiscount(0.1);
      setVoucherMessage({
        text: "Áp dụng mã giảm giá 10% thành công!",
        type: "success",
      });
    } else if (code === "SWOO20" || code === "VIP20") {
      setAppliedDiscount(0.2);
      setVoucherMessage({
        text: "Áp dụng mã ưu đãi VIP giảm 20% thành công!",
        type: "success",
      });
    } else {
      setVoucherMessage({
        text: "Mã ưu đãi không hợp lệ hoặc đã hết hạn!",
        type: "error",
      });
    }
  };

  // Toast Helper
  const showToast = (title, desc) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập họ";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Vui lòng nhập địa chỉ nhận hàng";
    if (!formData.city.trim())
      newErrors.city = "Vui lòng nhập tỉnh / thành phố";
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9+\s\-()]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập địa chỉ email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Email không đúng định dạng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast(
        "Giỏ hàng trống",
        "Vui lòng thêm sản phẩm trước khi thanh toán.",
      );
      return;
    }

    if (!validateForm()) {
      showToast(
        "Thiếu thông tin",
        "Vui lòng kiểm tra lại các trường bắt buộc.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const fullAddress = [
        formData.streetAddress,
        formData.apartment,
        formData.state,
        formData.city,
        formData.country === "VN" ? "Việt Nam" : formData.country,
      ]
        .filter(Boolean)
        .join(", ");

      const payload = {
        userId: user?.id ? Number(user.id) : undefined,
        products: items.map((item) => ({
          productId: Number(item.id),
          quantity: Number(item.quantity),
          price: Number(item.price),
          title: item.title,
          image: item.image,
        })),
        shippingInfo: {
          fullName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          address: fullAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          notes: formData.orderNotes,
        },
        paymentMethod,
        total: Number(grandTotal.toFixed(2)),
      };

      const createdOrder = await createOrder(payload);

      const successInfo = {
        orderId: createdOrder?.id ?? 0,
        createdAt: createdOrder?.createdAt ?? "",
        total: grandTotal,
        totalVND: grandTotalVND,
        items: [...items],
        shippingInfo: payload.shippingInfo,
        paymentMethod,
      };

      setOrderSuccessData(successInfo);
      cleanCart();
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });

      // Nếu chọn thanh toán Online qua mã QR -> Hiển thị Modal QR code thanh toán
      if (paymentMethod === "bank") {
        setShowQrModal(true);
      } else {
        showToast(
          "Đặt hàng thành công!",
          "Đơn hàng của bạn đã được ghi nhận vào hệ thống.",
        );
      }
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      showToast(
        "Đặt hàng thất bại",
        err.response?.data?.message ||
          "Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Khi khách hàng bấm button "Đã thanh toán"
  const handleConfirmPaid = () => {
    setShowQrModal(false);
    showToast(
      "Xác nhận đã thanh toán!",
      "Đang chuyển đến trang lịch sử đơn hàng của bạn...",
    );

    setTimeout(() => {
      if (isAuthenticated) {
        navigate("/account?tab=orders", { state: { tab: "orders" } });
      } else {
        navigate("/login", { state: { from: "/account?tab=orders" } });
      }
    }, 600);
  };

  // Dynamic VietQR image URL
  // Sử dụng template print hoặc compact2 với bankId đã sửa thành '970422' hoặc 'MBBank'
  const qrCodeUrl = orderSuccessData
    ? `https://img.vietqr.io/image/970422-${BANK_INFO.accountNumber}-compact2.png?amount=${orderSuccessData.totalVND}&addInfo=SWOO${orderSuccessData.orderId}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`
    : `https://img.vietqr.io/image/970422-${BANK_INFO.accountNumber}-compact2.png?amount=${grandTotalVND}&addInfo=SWOO_PAY&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      {/* Header */}
      <Header onSearch={(e) => e.preventDefault()} />

      <main className="flex-1 w-full pb-16">
        {/* Breadcrumb Navigation Bar */}
        <div className="w-full bg-[#eff4ff] py-3 border-b border-slate-200/80 shadow-xs">
          <div className="max-w-[1360px] mx-auto px-4 flex items-center gap-2 text-xs font-semibold text-[#565e74]">
            <Link
              to="/"
              className="hover:text-[#006948] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                home
              </span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-slate-400">
              chevron_right
            </span>
            <Link to="/cart" className="hover:text-[#006948] transition-colors">
              Shop Cart
            </Link>
            <span className="material-symbols-outlined text-[14px] text-slate-400">
              chevron_right
            </span>
            <span className="text-[#0b1c30] font-bold">Checkout</span>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 pt-8">
          {/* Section 5: Two-Column Direct Checkout */}
          <div className="flex flex-col gap-6" id="checkout-direct-section">
            {/* Accordion Login / Coupon Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Login Prompt Card */}
              <div className="bg-[#eff4ff] p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm text-[#3d4a42] border border-slate-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#006948] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      person
                    </span>
                  </div>
                  {isAuthenticated && user ? (
                    <div>
                      <span>Đã đăng nhập: </span>
                      <strong className="text-[#0b1c30]">
                        {user.fullName || user.username || user.email}
                      </strong>
                    </div>
                  ) : (
                    <div>
                      <span>Khách hàng quen thuộc? </span>
                      <Link
                        to="/login"
                        className="text-[#006948] font-bold hover:underline"
                      >
                        Bấm vào đây để đăng nhập
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Voucher Prompt Card */}
              <div className="bg-[#eff4ff] p-4 rounded-xl flex flex-col justify-center text-xs sm:text-sm text-[#3d4a42] border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[#825100] shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        redeem
                      </span>
                    </div>
                    <span>
                      Có mã giảm giá?{" "}
                      <button
                        type="button"
                        onClick={() => setShowVoucherInput((prev) => !prev)}
                        className="text-[#006948] font-bold hover:underline cursor-pointer"
                      >
                        {showVoucherInput ? "Ẩn nhập mã" : "Nhập mã voucher"}
                      </button>
                    </span>
                  </div>
                  {appliedDiscount > 0 && (
                    <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                      -{appliedDiscount * 100}%
                    </span>
                  )}
                </div>

                {/* Collapsible Coupon Input */}
                {showVoucherInput && (
                  <form
                    onSubmit={handleApplyVoucher}
                    className="mt-3 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Nhập mã (VD: SWOO10, SWOO20)..."
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#0b1c30] uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#006948]/30"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Áp dụng
                    </button>
                  </form>
                )}

                {voucherMessage.text && (
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      voucherMessage.type === "success"
                        ? "text-emerald-700"
                        : "text-red-600"
                    }`}
                  >
                    {voucherMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* Main Two-Column Layout */}
            <form
              onSubmit={handlePlaceOrder}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Billing Information Form (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
                    Billing & Shipping Details
                  </h2>
                  <p className="text-xs sm:text-sm text-[#565e74] mt-1">
                    Vui lòng cung cấp chính xác địa chỉ và số điện thoại để đảm
                    bảo giao hàng nhanh chóng.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0b1c30]">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g. Huyền"
                        className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-transparent"
                        } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
                      />
                      {errors.firstName && (
                        <span className="text-xs text-red-500">
                          {errors.firstName}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0b1c30]">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="e.g. Lã Ngọc"
                        className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                          errors.lastName
                            ? "border-red-500"
                            : "border-transparent"
                        } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
                      />
                      {errors.lastName && (
                        <span className="text-xs text-red-500">
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#0b1c30]">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. SWOO Tech Vietnam LLC"
                      className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all"
                    />
                  </div>

                  {/* Country / Region */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#0b1c30]">
                      Country / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all cursor-pointer"
                    >
                      <option value="VN">Vietnam (VN)</option>
                      <option value="US">United States (US)</option>
                      <option value="JP">Japan (JP)</option>
                      <option value="KR">South Korea (KR)</option>
                      <option value="SG">Singapore (SG)</option>
                    </select>
                  </div>

                  {/* Street Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#0b1c30]">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="Số nhà, tên đường, thôn xóm / phố"
                      className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                        errors.streetAddress
                          ? "border-red-500"
                          : "border-transparent"
                      } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
                    />
                    {errors.streetAddress && (
                      <span className="text-xs text-red-500">
                        {errors.streetAddress}
                      </span>
                    )}
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Căn hộ, số phòng, tòa nhà (tùy chọn)"
                      className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all"
                    />
                  </div>

                  {/* Town / City, State / County, Postcode / ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0b1c30]">
                        Town / City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Hà Nội"
                        className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                          errors.city ? "border-red-500" : "border-transparent"
                        } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
                      />
                      {errors.city && (
                        <span className="text-xs text-red-500">
                          {errors.city}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0b1c30]">
                        State / County
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Quận Hai Bà Trưng"
                        className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0b1c30]">
                        Postcode / ZIP
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="100000"
                        className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number & Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0b1c30]">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0824781531"
                        className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                          errors.phone ? "border-red-500" : "border-transparent"
                        } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-500">
                          {errors.phone}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0b1c30]">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@swootechmart.com"
                        className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                          errors.email ? "border-red-500" : "border-transparent"
                        } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
                      />
                      {errors.email && (
                        <span className="text-xs text-red-500">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Save information checkbox */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="save-info"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded text-[#006948] focus:ring-[#006948] accent-[#006948] cursor-pointer"
                    />
                    <label
                      htmlFor="save-info"
                      className="text-xs text-[#0b1c30] cursor-pointer select-none font-medium"
                    >
                      Lưu thông tin giao hàng cho lần thanh toán nhanh tiếp theo
                    </label>
                  </div>

                  {/* Order Notes */}
                  <div className="pt-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#0b1c30]">
                      Order Notes & Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Ghi chú thêm về đơn hàng (ví dụ: giờ giao hàng thuận tiện, gọi điện trước khi đến, hướng dẫn gửi hàng bảo vệ)..."
                      className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Payment Gateway (5 cols) */}
              <div className="lg:col-span-5 bg-[#eff4ff] p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
                    Your Order Summary
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006948] bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">
                      lock
                    </span>
                    Verified Session
                  </span>
                </div>

                {/* Line items review box */}
                <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/60">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-[11px] font-bold text-[#565e74] uppercase tracking-wider">
                    <span>Item Description</span>
                    <span>Subtotal</span>
                  </div>

                  {items.length === 0 ? (
                    <div className="py-8 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        shopping_bag
                      </span>
                      <p className="mt-2 text-xs text-slate-500">
                        Không có sản phẩm nào trong giỏ hàng.
                      </p>
                      <Link
                        to="/"
                        className="mt-3 inline-block text-xs font-bold text-[#006948] hover:underline"
                      >
                        Quay lại mua sắm ngay
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 pt-2"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg bg-[#eff4ff] p-1 shrink-0 flex items-center justify-center border border-slate-200/50">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#0b1c30] truncate leading-tight">
                                {item.title}
                              </h4>
                              <span className="text-[11px] text-[#565e74]">
                                Số lượng: {item.quantity} ×{" "}
                                {formatMoney(item.price)}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#0b1c30] shrink-0">
                            {formatMoney(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Calculations */}
                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-[#3d4a42]">
                    <div className="flex justify-between">
                      <span>Cart Subtotal</span>
                      <span className="font-semibold text-[#0b1c30]">
                        {formatMoney(subTotal)}
                      </span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>
                          Voucher Discount (-{appliedDiscount * 100}%)
                        </span>
                        <span>-{formatMoney(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Worldwide Insured Shipping</span>
                      <span className="font-semibold text-[#006948]">
                        {isFreeShipping
                          ? "FREE (Đơn > $199)"
                          : `+${formatMoney(rawShipping)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Regulatory Eco Tax</span>
                      <span className="font-semibold text-[#0b1c30]">
                        $0.00
                      </span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#0b1c30] block">
                        Total Due
                      </span>
                      <span className="text-[11px] text-[#565e74]">
                        ≈ {formatVND(grandTotalVND)}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#006948] tracking-tight">
                      {formatMoney(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Payment Options Selection */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-[#0b1c30]">
                    Select Payment Gateway
                  </h3>

                  {/* Option 1: QR Code & Online Banking (Primary) */}
                  <label
                    className={`p-4 rounded-xl bg-white cursor-pointer flex flex-col gap-2 border transition-all ${
                      paymentMethod === "bank"
                        ? "border-[#006948] ring-2 ring-[#006948]/20 shadow-sm"
                        : "border-slate-200/70 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_method"
                          value="bank"
                          checked={paymentMethod === "bank"}
                          onChange={() => setPaymentMethod("bank")}
                          className="accent-[#006948] w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                              Thanh toán Online qua mã QR (VietQR)
                            </span>
                            <span className="bg-emerald-100 text-[#006948] font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                              Khuyên dùng
                            </span>
                          </div>
                          <span className="text-[11px] text-[#565e74]">
                            Quét mã QR tiện lợi qua mọi ứng dụng ngân hàng / ví
                            điện tử
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#006948] text-[24px]">
                        qr_code_scanner
                      </span>
                    </div>

                    {paymentMethod === "bank" && (
                      <div className="ml-7 mt-2 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-700">
                        <div className="w-28 h-28 bg-white p-1.5 rounded-lg border border-emerald-200 shadow-xs shrink-0 flex items-center justify-center">
                          <img
                            src={qrCodeUrl}
                            alt="VietQR Payment Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div>
                            <span className="text-slate-500">Ngân hàng: </span>
                            <strong className="text-slate-900">
                              {BANK_INFO.bankName}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500">
                              Số tài khoản:{" "}
                            </span>
                            <strong className="text-emerald-700 font-mono text-sm">
                              {BANK_INFO.accountNumber}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500">
                              Chủ tài khoản:{" "}
                            </span>
                            <strong className="text-slate-900">
                              {BANK_INFO.accountName}
                            </strong>
                          </div>
                          <p className="text-[11px] text-emerald-800 italic pt-1">
                            Bấm "PLACE ORDER NOW" để mở mã QR chính thức kèm mã
                            đơn hàng và hoàn tất thanh toán.
                          </p>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 2: Cash On Delivery */}
                  <label
                    className={`p-4 rounded-xl bg-white cursor-pointer flex items-center justify-between border transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#006948] ring-2 ring-[#006948]/20 shadow-sm"
                        : "border-slate-200/70 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-[#006948] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                          Cash on Express Delivery (COD)
                        </span>
                        <p className="text-xs text-[#565e74]">
                          Thanh toán tiền mặt tận nơi khi nhận hàng
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#565e74] text-[22px]">
                      local_atm
                    </span>
                  </label>

                  {/* Option 3: PayPal Express */}
                  <label
                    className={`p-4 rounded-xl bg-white cursor-pointer flex items-center justify-between border transition-all ${
                      paymentMethod === "paypal"
                        ? "border-[#006948] ring-2 ring-[#006948]/20 shadow-sm"
                        : "border-slate-200/70 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="accent-[#006948] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                          PayPal / Credit Cards
                        </span>
                        <p className="text-xs text-[#565e74]">
                          Thanh toán online quốc tế qua Visa, Mastercard, PayPal
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#006948] bg-slate-100 px-2 py-1 rounded">
                      <i className="fa-brands fa-paypal text-sm text-[#003087]" />
                      <span>PayPal</span>
                    </div>
                  </label>
                </div>

                {/* Security & Submission */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full h-13 bg-[#006948] hover:bg-[#00855d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-[#006948]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>ĐANG TẠO ĐƠN HÀNG...</span>
                      </>
                    ) : paymentMethod === "bank" ? (
                      <>
                        <span className="material-symbols-outlined text-[20px]">
                          qr_code
                        </span>
                        <span>TIẾN HÀNH THANH TOÁN QR</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">
                          lock
                        </span>
                        <span>PLACE ORDER NOW</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#6d7a72]">
                    <span className="material-symbols-outlined text-[15px] text-[#006948]">
                      verified
                    </span>
                    <span>
                      Protected by 256-Bit SSL End-to-End Encryption Guarantee
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Interactive Toast Element */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 bg-[#213145] text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md animate-bounce">
          <div className="w-9 h-9 rounded-full bg-[#006948] flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px]">done</span>
          </div>
          <div>
            <h5 className="text-sm font-bold">{toastMessage.title}</h5>
            <p className="text-xs text-white/80 mt-0.5">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL THANH TOÁN QR VỚI BUTTON "ĐÃ THANH TOÁN"           */}
      {/* ======================================================== */}
      {showQrModal && orderSuccessData && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in duration-200">
            {/* Header modal */}
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#006948] px-3 py-1 rounded-full text-xs font-extrabold mb-2">
                <span className="material-symbols-outlined text-[16px]">
                  qr_code_2
                </span>
                <span>Thanh toán VietQR 24/7</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
                Quét mã QR để thanh toán
              </h3>
              <p className="text-xs text-[#565e74] mt-1">
                Đơn hàng:{" "}
                <strong className="text-[#006948] font-mono text-sm">
                  #SW-{orderSuccessData.orderId}
                </strong>{" "}
                · Tổng thanh toán:{" "}
                <strong className="text-[#0b1c30] text-sm">
                  {formatMoney(orderSuccessData.total)}
                </strong>{" "}
                (≈ {formatVND(orderSuccessData.totalVND)})
              </p>
            </div>

            {/* QR Code Container */}
            <div className="py-5 flex flex-col items-center justify-center">
              <div className="relative p-3 bg-white rounded-2xl border-2 border-emerald-500/80 shadow-md flex flex-col items-center">
                <img
                  src={`https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNumber}-compact2.png?amount=${orderSuccessData.totalVND}&addInfo=SWOO${orderSuccessData.orderId}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`}
                  alt="Mã QR thanh toán đơn hàng"
                  className="w-64 h-auto max-w-full rounded-xl object-contain"
                />
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider mt-2 uppercase">
                  Quét bằng App ngân hàng bất kỳ
                </span>
              </div>
            </div>

            {/* Thông tin chuyển khoản chi tiết có nút copy */}
            <div className="bg-[#eff4ff] p-4 rounded-2xl text-xs space-y-2.5 border border-slate-200/70">
              <div className="flex items-center justify-between">
                <span className="text-[#565e74]">Ngân hàng:</span>
                <strong className="text-[#0b1c30]">{BANK_INFO.bankName}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#565e74]">Chủ tài khoản:</span>
                <strong className="text-[#0b1c30]">
                  {BANK_INFO.accountName}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#565e74]">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <strong className="text-[#006948] font-mono text-sm">
                    {BANK_INFO.accountNumber}
                  </strong>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(BANK_INFO.accountNumber, "accountNumber")
                    }
                    className="p-1 hover:bg-white rounded text-slate-500 hover:text-[#006948] transition-colors cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedField === "accountNumber"
                        ? "check"
                        : "content_copy"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#565e74]">Số tiền chuyển:</span>
                <div className="flex items-center gap-2">
                  <strong className="text-emerald-700 font-mono text-sm">
                    {formatVND(orderSuccessData.totalVND)}
                  </strong>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        String(orderSuccessData.totalVND),
                        "amount",
                      )
                    }
                    className="p-1 hover:bg-white rounded text-slate-500 hover:text-[#006948] transition-colors cursor-pointer"
                    title="Sao chép số tiền"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedField === "amount" ? "check" : "content_copy"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#565e74]">Nội dung chuyển khoản:</span>
                <div className="flex items-center gap-2">
                  <strong className="text-[#006948] font-mono text-sm bg-white px-2 py-0.5 rounded border border-slate-200">
                    SWOO{orderSuccessData.orderId}
                  </strong>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `SWOO${orderSuccessData.orderId}`,
                        "content",
                      )
                    }
                    className="p-1 hover:bg-white rounded text-slate-500 hover:text-[#006948] transition-colors cursor-pointer"
                    title="Sao chép nội dung"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedField === "content" ? "check" : "content_copy"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trạng thái chờ */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#565e74]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>
                Sau khi chuyển khoản thành công, vui lòng bấm nút bên dưới.
              </span>
            </div>

            {/* CÁC NÚT HÀNH ĐỘNG — NÚT "ĐÃ THANH TOÁN" */}
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleConfirmPaid}
                className="w-full py-3.5 bg-[#006948] hover:bg-[#00855d] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#006948]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">
                  check_circle
                </span>
                <span>ĐÃ THANH TOÁN</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQrModal(false);
                  navigate("/");
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#565e74] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Để thanh toán sau & Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal cho COD / PayPal */}
      {orderSuccessData && !showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#006948] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">
                check_circle
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-center text-[#0b1c30]">
              Đặt hàng thành công!
            </h3>
            <p className="text-center text-xs sm:text-sm text-[#565e74] mt-1">
              Mã đơn hàng của bạn là:{" "}
              <strong className="text-[#006948]">
                #SW-{orderSuccessData.orderId}
              </strong>
            </p>

            <div className="mt-6 bg-[#eff4ff] p-4 rounded-xl text-xs space-y-2 border border-slate-200/60">
              <div className="flex justify-between">
                <span className="text-[#565e74]">Người nhận:</span>
                <strong className="text-[#0b1c30]">
                  {orderSuccessData.shippingInfo.fullName}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Số điện thoại:</span>
                <strong className="text-[#0b1c30]">
                  {orderSuccessData.shippingInfo.phone}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Địa chỉ:</span>
                <span className="text-[#0b1c30] text-right font-medium max-w-xs truncate">
                  {orderSuccessData.shippingInfo.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Phương thức thanh toán:</span>
                <span className="capitalize font-bold text-[#006948]">
                  {orderSuccessData.paymentMethod === "bank"
                    ? "Chuyển khoản QR ngân hàng"
                    : orderSuccessData.paymentMethod === "cod"
                      ? "Thu hộ tiền mặt (COD)"
                      : "PayPal / Thẻ trực tuyến"}
                </span>
              </div>
              <div className="border-t border-slate-200/80 pt-2 flex justify-between text-sm">
                <span className="font-bold text-[#0b1c30]">
                  Tổng thanh toán:
                </span>
                <strong className="text-base text-[#006948]">
                  {formatMoney(orderSuccessData.total)}
                </strong>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/account?tab=orders", {
                      state: { tab: "orders" },
                    });
                  } else {
                    navigate("/login", {
                      state: { from: "/account?tab=orders" },
                    });
                  }
                }}
                className="w-full py-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006948] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Xem lịch sử đơn hàng
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-2.5 bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Tiếp tục mua hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
