import { z } from "zod";

export const productSchema = z.object({
  title: z.string().trim().min(3, {
    message: "Tên sản phẩm phải có ít nhất 3 ký tự",
  }),

  price: z.coerce.number().positive({
    message: "Giá sản phẩm phải lớn hơn 0",
  }),

  category: z.string().trim().min(1, {
    message: "Vui lòng chọn hoặc nhập danh mục",
  }),

  description: z
    .string()
    .trim()
    .max(1500, {
      message: "Mô tả tối đa 1500 ký tự",
    })
    .optional(),

  image: z
    .union([z.string().trim().url("Image phải là URL hợp lệ"), z.literal("")])
    .optional(),
});
