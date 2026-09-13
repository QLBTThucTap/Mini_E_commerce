/**
 * Cấu hình thông tin tài khoản nhận chuyển khoản ngân hàng (VietQR)
 */
export const BANK_INFO = {
  bankId: "970422",
  bankName: "MB Bank (Ngân hàng Quân đội)",
  accountNumber: "08018536368888",
  accountName: "LA NGOC HUYEN",
};

/**
 * Cấu hình thương hiệu & cột liên kết chân trang
 */
export const FOOTER_BRAND = {
  name: "LH - 1ST NYC TECH ONLINE MARKET",
  hotline: "0824781531",
  address: "273 phố Bạch Mai, quận Hai Bà Trưng, Hà Nội",
  email: "contact@swootechmart.com",
};

export const FOOTER_COLUMNS = [
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

/**
 * Định dạng tiền tệ USD
 */
export function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
}

/**
 * Định dạng tiền tệ VND
 */
export function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount) || 0);
}

/**
 * Tính toán các giá trị tổng tiền, phí vận chuyển và giảm giá
 */
export function calculateOrderPricing(items = [], appliedDiscount = 0) {
  const subTotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  const rawShipping = subTotal >= 199 || subTotal === 0 ? 0 : 9.5;
  const isFreeShipping = subTotal >= 199 && subTotal > 0;
  const discountAmount = subTotal * appliedDiscount;
  const grandTotal = Math.max(0, subTotal - discountAmount + rawShipping);
  const grandTotalVND = Math.round(grandTotal * 25400);

  return {
    subTotal,
    rawShipping,
    isFreeShipping,
    discountAmount,
    grandTotal,
    grandTotalVND,
  };
}

/**
 * Sinh đường dẫn hình ảnh VietQR tự động
 */
export function generateQrCodeUrl(bankInfo, totalVND, orderId) {
  const addInfo = orderId ? `SWOO${orderId}` : "SWOO_PAY";
  return `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-compact2.png?amount=${totalVND}&addInfo=${addInfo}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
}

/**
 * Hàm sao chép nội dung vào Clipboard
 */
export async function copyTextToClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}
