import { z } from "zod";

/**
 * Schema xác thực thông tin giao hàng & thanh toán (Billing & Shipping Details)
 */
export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập tên (First Name)" }),

  lastName: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập họ (Last Name)" }),

  company: z.string().trim().optional(),

  country: z.string().trim().min(1, { message: "Vui lòng chọn quốc gia" }),

  streetAddress: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập địa chỉ nhận hàng" }),

  apartment: z.string().trim().optional(),

  city: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập tỉnh / thành phố" }),

  state: z.string().trim().optional(),

  zipCode: z.string().trim().optional(),

  phone: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập số điện thoại" })
    .regex(/^[0-9+\s\-()]{8,15}$/, {
      message: "Số điện thoại không đúng định dạng",
    }),

  email: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập địa chỉ email" })
    .email({ message: "Email không đúng định dạng" }),

  orderNotes: z.string().trim().optional(),

  saveInfo: z.boolean().optional(),
});

/**
 * Schema xác thực mã giảm giá (Coupon / Voucher)
 */
export const voucherSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập mã giảm giá" })
    .toUpperCase(),
});
