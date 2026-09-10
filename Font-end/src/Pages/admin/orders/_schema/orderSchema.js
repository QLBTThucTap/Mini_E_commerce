import { z } from "zod";

export const orderSchema = z.object({
  shippingInfo: z.object({
    fullName: z.string().trim().min(2, {
      message: "Họ tên phải có ít nhất 2 ký tự",
    }),

    phone: z.string().trim().min(8, {
      message: "Số điện thoại không hợp lệ",
    }),

    address: z.string().trim().min(5, {
      message: "Địa chỉ phải có ít nhất 5 ký tự",
    }),
  }),

  paymentMethod: z.enum(["cod", "bank_transfer"], {
    message: "Vui lòng chọn phương thức thanh toán",
  }),

  status: z.enum(["pending", "shipping", "delivered", "cancelled"], {
    message: "Vui lòng chọn trạng thái",
  }),

  products: z
    .array(
      z.object({
        productId: z.coerce
          .number({ message: "Vui lòng chọn sản phẩm" })
          .positive({ message: "Vui lòng chọn sản phẩm" }),

        quantity: z.coerce
          .number({ message: "Số lượng không hợp lệ" })
          .int()
          .positive({ message: "Số lượng phải lớn hơn 0" }),
      }),
    )
    .min(1, { message: "Đơn hàng cần ít nhất 1 sản phẩm" }),
});
