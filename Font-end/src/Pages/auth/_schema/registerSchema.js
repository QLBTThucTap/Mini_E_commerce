import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, {
      message: "Họ và tên phải từ 2 ký tự trở lên",
    }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Email bắt buộc phải nhập" })
      .email({ message: "Email phải đúng định dạng" })
      .refine((val) => !val.toLowerCase().includes("admin"), {
        message: "Email không được chứa từ 'admin'",
      }),
    password: z.string().trim().min(6, {
      message: "Mật khẩu phải từ 6 ký tự trở lên",
    }),
    confirm_password: z.string().trim().min(1, {
      message: "Vui lòng nhập lại mật khẩu",
    }),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "Vui lòng đồng ý với Điều khoản và Chính sách",
    }),
  })
  .superRefine(({ password, confirm_password }, context) => {
    if (password !== confirm_password) {
      context.addIssue({
        code: "custom",
        message: "Mật khẩu xác nhận không khớp!",
        path: ["confirm_password"],
      });
    }
  });
