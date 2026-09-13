import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  email: z.string().trim().email({ message: "Email không đúng định dạng" }),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^(0[3|5|7|8|9][0-9]{8})?$/, {
      message: "Số điện thoại không hợp lệ (VD: 0912345678)",
    })
    .optional()
    .or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
});

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, { message: "Mật khẩu mới phải từ 6 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
