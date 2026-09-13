import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../../Stores/authStore";
import { updateUser } from "../../../Services/userService";
import { passwordSchema } from "../_schema/accountSchema";

export function useAccountPassword() {
  const user = useAuthStore((state) => state.user);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  const formMethods = useForm({ resolver: zodResolver(passwordSchema) });

  const passwordMutation = useMutation({
    mutationFn: (data) => updateUser(user.id, { password: data.newPassword }),
    onSuccess: () => {
      setPwSuccess("Đổi mật khẩu thành công!");
      setPwError("");
      formMethods.reset();
      setTimeout(() => setPwSuccess(""), 3000);
    },
    onError: (err) => {
      setPwError(
        err.response?.data?.message || "Đổi mật khẩu thất bại. Thử lại.",
      );
    },
  });

  const onPasswordSubmit = (data) => passwordMutation.mutate(data);

  return {
    pwSuccess,
    pwError,
    formMethods,
    passwordMutation,
    onPasswordSubmit,
  };
}
