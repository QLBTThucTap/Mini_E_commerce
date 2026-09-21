import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../../Stores/authStore";
import { updateUser } from "../../../Services/userService";
import { profileSchema } from "../_schema/accountSchema";
import { toast } from "react-toastify";

export function useAccountProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const loginAction = useAuthStore((state) => state.login);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const displayName =
    user?.fullName ||
    (typeof user?.name === "string"
      ? user.name
      : typeof user?.name === "object"
        ? `${user.name?.firstname || ""} ${user.name?.lastname || ""}`.trim()
        : user?.username || "Người dùng");

  const formMethods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: displayName,
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || user?.phone || "",
      gender: ["Male", "Female", "Other"].includes(user?.gender)
        ? user.gender
        : "Other",
      dateOfBirth: user?.dateOfBirth || "",
      city: typeof user?.address === "object" ? user.address?.city || "" : "",
      district:
        typeof user?.address === "object" ? user.address?.district || "" : "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(user.id, data),
    onSuccess: (updated) => {
      loginAction({ user: { ...user, ...updated }, accessToken, refreshToken });
      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
      toast.success("Cập nhật thông tin thành công!");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Cập nhật thông tin thất bại, vui lòng thử lại sau!",
      );
    },
  });

  const onProfileSubmit = (data) => {
    updateMutation.mutate({
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber?.trim() || "",
      gender: data.gender,
      dateOfBirth: data.dateOfBirth || "",
      address: {
        city: data.city?.trim() || "",
        district: data.district?.trim() || "",
      },
    });
  };

  return {
    user,
    displayName,
    formMethods,
    updateMutation,
    onProfileSubmit,
  };
}
