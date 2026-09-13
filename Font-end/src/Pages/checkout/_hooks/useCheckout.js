import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useCartStore from "../../../Stores/cartStore";
import useAuthStore from "../../../Stores/authStore";
import { createOrder } from "../../../Services/orderService";
import { checkoutFormSchema } from "../_schema/checkoutSchema";
import {
  BANK_INFO,
  calculateOrderPricing,
  copyTextToClipboard,
  generateQrCodeUrl,
} from "../_utils/checkoutUtils";

export function useCheckout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Stores
  const items = useCartStore((state) => state.items);
  const cleanCart = useCartStore((state) => state.cleanCart);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Parse Initial Name
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

  // Form State
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
  const pricing = useMemo(
    () => calculateOrderPricing(items, appliedDiscount),
    [items, appliedDiscount],
  );

  // Copy helper
  const handleCopy = useCallback(async (text, fieldName) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    }
  }, []);

  // Toast Helper
  const showToast = useCallback((title, desc) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Handle Input Changes
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  // Handle Apply Coupon
  const handleApplyVoucher = useCallback(
    (e) => {
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
    },
    [voucherCode],
  );

  // Form Validation using Zod
  const validateForm = useCallback(() => {
    const result = checkoutFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData]);

  // Submit Order
  const handlePlaceOrder = useCallback(
    async (e) => {
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
          total: Number(pricing.grandTotal.toFixed(2)),
        };

        const createdOrder = await createOrder(payload);

        const successInfo = {
          orderId: createdOrder?.id ?? 0,
          createdAt: createdOrder?.createdAt ?? "",
          total: pricing.grandTotal,
          totalVND: pricing.grandTotalVND,
          items: [...items],
          shippingInfo: payload.shippingInfo,
          paymentMethod,
        };

        setOrderSuccessData(successInfo);
        cleanCart();
        queryClient.invalidateQueries({ queryKey: ["user-orders"] });

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
    },
    [
      items,
      validateForm,
      formData,
      user,
      paymentMethod,
      pricing.grandTotal,
      pricing.grandTotalVND,
      cleanCart,
      queryClient,
      showToast,
    ],
  );

  // Khi khách hàng bấm button "Đã thanh toán"
  const handleConfirmPaid = useCallback(() => {
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
  }, [isAuthenticated, navigate, showToast]);

  const qrCodeUrl = useMemo(() => {
    return generateQrCodeUrl(
      BANK_INFO,
      orderSuccessData ? orderSuccessData.totalVND : pricing.grandTotalVND,
      orderSuccessData?.orderId,
    );
  }, [orderSuccessData, pricing.grandTotalVND]);

  return {
    items,
    user,
    isAuthenticated,
    formData,
    errors,
    pricing,
    showVoucherInput,
    setShowVoucherInput,
    voucherCode,
    setVoucherCode,
    appliedDiscount,
    voucherMessage,
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    toastMessage,
    orderSuccessData,
    showQrModal,
    setShowQrModal,
    copiedField,
    qrCodeUrl,
    bankInfo: BANK_INFO,
    handleInputChange,
    handleApplyVoucher,
    handlePlaceOrder,
    handleConfirmPaid,
    handleCopy,
  };
}
