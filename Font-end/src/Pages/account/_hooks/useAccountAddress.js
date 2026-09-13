import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../../Stores/authStore";
import { updateUser } from "../../../Services/userService";

export function useAccountAddress() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const loginAction = useAuthStore((state) => state.login);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  // Lấy họ tên hiển thị chuẩn
  const displayName =
    user?.fullName ||
    (typeof user?.name === "string"
      ? user.name
      : typeof user?.name === "object"
        ? `${user.name?.firstname || ""} ${user.name?.lastname || ""}`.trim()
        : user?.username || "Người dùng");

  // Fallback lấy danh sách địa chỉ từ user trong data/users.js
  const addresses = useMemo(() => {
    if (Array.isArray(user?.addresses) && user.addresses.length > 0) {
      return user.addresses;
    }
    // Nếu trong data chỉ có object address đơn lẻ (address: { city, district, street... })
    if (user?.address && typeof user.address === "object") {
      return [
        {
          id: 1,
          name: displayName,
          phone: user?.phoneNumber || user?.phone || "",
          street: user.address?.street || "Địa chỉ hiện tại",
          city: `${user.address?.district || ""}, ${user.address?.city || ""}`.replace(/^,\s*/, ""),
          country: "Việt Nam",
          type: "Home",
          isDefault: true,
        },
      ];
    }
    return [];
  }, [user, displayName]);

  // Mutation cập nhật danh sách địa chỉ vào Server / data mock
  const updateAddressMutation = useMutation({
    mutationFn: (newAddresses) =>
      updateUser(user.id, {
        addresses: newAddresses,
        // Cập nhật luôn thông tin address mặc định ở root user để đồng bộ
        address: {
          city: newAddresses.find((a) => a.isDefault)?.city || "",
          district: "",
        },
      }),
    onSuccess: (updatedUser) => {
      // Cập nhật Auth Store lập tức
      loginAction({
        user: { ...user, ...updatedUser },
        accessToken,
        refreshToken,
      });
      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
    },
  });

  // Xử lý các thao tác CRUD
  const saveAddresses = (newAddresses) => {
    updateAddressMutation.mutate(newAddresses);
  };

  const setDefaultAddress = (id) => {
    const updated = addresses.map((item) => ({
      ...item,
      isDefault: item.id === id,
    }));
    saveAddresses(updated);
  };

  const deleteAddress = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      const updated = addresses.filter((item) => item.id !== id);
      // Nếu xóa địa chỉ mặc định, tự động gán địa chỉ đầu tiên làm mặc định
      if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
        updated[0].isDefault = true;
      }
      saveAddresses(updated);
    }
  };

  const addOrUpdateAddress = (formData, editingId) => {
    // Sửa lỗi: dùng toán tử ba ngôi (ternary) trực tiếp cho hằng số const updated
    const nextAddresses = editingId
      ? addresses.map((item) =>
          item.id === editingId ? { ...formData, id: item.id } : item
        )
      : formData.isDefault || addresses.length === 0
      ? addresses.map((a) => ({ ...a, isDefault: false })).concat({
          ...formData,
          id: Date.now(),
        })
      : [...addresses, { ...formData, id: Date.now() }];

    // Đảm bảo luôn có 1 địa chỉ làm mặc định nếu danh sách không trống
    if (nextAddresses.length > 0 && !nextAddresses.some((a) => a.isDefault)) {
      nextAddresses[0].isDefault = true;
    }

    saveAddresses(nextAddresses);
  };

  return {
    user,
    displayName,
    addresses,
    isUpdating: updateAddressMutation.isPending,
    setDefaultAddress,
    deleteAddress,
    addOrUpdateAddress,
  };
}