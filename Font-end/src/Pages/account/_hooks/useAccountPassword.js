import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../../Stores/authStore";
import { updateUser } from "../../../Services/userService";
import { passwordSchema } from "../_schema/accountSchema";
import { toast } from "react-toastify";

export function useAccountPassword() {
  const user = useAuthStore((state) => state.user);
  const formMethods = useForm({ resolver: zodResolver(passwordSchema) });

  const passwordMutation = useMutation({
    mutationFn: (data) => updateUser(user.id, { password: data.newPassword }),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      formMethods.reset();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Đổi mật khẩu thất bại. Vui lòng thử lại!",
      );
    },
  });

  const onPasswordSubmit = (data) => passwordMutation.mutate(data);

  return {
    formMethods,
    passwordMutation,
    onPasswordSubmit,
  };
}
