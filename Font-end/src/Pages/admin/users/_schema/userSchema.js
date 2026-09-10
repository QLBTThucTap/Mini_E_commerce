import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().trim().min(2, {
    message: "Họ và tên phải có ít nhất 2 ký tự",
  }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Email không đúng định dạng" }),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^(0[3|5|7|8|9][0-9]{8})?$/, {
      message: "Số điện thoại không hợp lệ (VD: 0912345678)",
    })
    .optional()
    .or(z.literal("")),
  password: z.string().trim().min(6, {
    message: "Mật khẩu phải từ 6 ký tự trở lên",
  }),
  role: z.enum(["user", "admin"], {
    error: () => ({ message: "Vui lòng chọn vai trò" }),
  }),
  gender: z.enum(["Male", "Female", "Other"]).default("Other"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  isLocked: z.boolean().default(false),
});

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2, {
    message: "Họ và tên phải có ít nhất 2 ký tự",
  }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Email không đúng định dạng" }),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^(0[3|5|7|8|9][0-9]{8})?$/, {
      message: "Số điện thoại không hợp lệ (VD: 0912345678)",
    })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .trim()
    .refine((val) => val === "" || val.length >= 6, {
      message: "Mật khẩu mới phải từ 6 ký tự trở lên (hoặc để trống nếu không đổi)",
    })
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "admin"], {
    error: () => ({ message: "Vui lòng chọn vai trò" }),
  }),
  gender: z.enum(["Male", "Female", "Other"]).default("Other"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  isLocked: z.boolean().default(false),
});
