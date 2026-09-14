import * as z from "zod";

export const loginSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Tên đăng nhập bắt buộc phải nhập" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Mật khẩu phải từ 6 ký tự trở lên" }),
});
