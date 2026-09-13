import { z } from "zod";

/**
 * Schema xác thực dữ liệu cho một sản phẩm trong danh sách yêu thích
 */
export const wishlistItemSchema = z.object({
  id: z.union([z.number(), z.string()], {
    message: "ID sản phẩm không hợp lệ",
  }),
  title: z
    .string()
    .trim()
    .min(1, { message: "Tên sản phẩm không được để trống" }),
  price: z.coerce.number().min(0, {
    message: "Giá sản phẩm phải lớn hơn hoặc bằng 0",
  }),
  image: z.string().optional().default(""),
  category: z.string().optional().default(""),
  description: z.string().optional().default(""),
  stockStatus: z
    .enum(["in_stock", "out_of_stock", "pre_order"])
    .optional()
    .default("in_stock"),
});

/**
 * Schema xác thực bộ lọc / sắp xếp trong trang Wishlist
 */
export const wishlistFilterSchema = z.object({
  sortBy: z.enum(["default", "price_asc", "price_desc", "name_asc"]).default("default"),
  searchTerm: z.string().trim().optional().default(""),
});
