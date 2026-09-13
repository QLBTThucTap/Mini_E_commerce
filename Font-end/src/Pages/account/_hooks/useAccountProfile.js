import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../../Stores/authStore";
import { updateUser } from "../../../Services/userService";
import { profileSchema } from "../_schema/accountSchema";

export function useAccountProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const loginAction = useAuthStore((state) => state.login);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [saveSuccess, setSaveSuccess] = useState("");

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
      setSaveSuccess("Cập nhật thông tin thành công!");
      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
      setTimeout(() => setSaveSuccess(""), 3000);
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
    saveSuccess,
    formMethods,
    updateMutation,
    onProfileSubmit,
  };
}
