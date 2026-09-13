import { useState } from "react";
import Button from "../../../Components/ui/Button";
import { useAccountAddress } from "../_hooks/useAccountAddress";

export default function TabAddress() {
  const {
    user,
    displayName,
    addresses,
    isUpdating,
    setDefaultAddress,
    deleteAddress,
    addOrUpdateAddress,
  } = useAccountAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    country: "Việt Nam",
    type: "Home",
    isDefault: false,
  });

  // Mở Modal Thêm mới
  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormData({
      name: displayName,
      phone: user?.phoneNumber || user?.phone || "",
      street: "",
      city: "",
      country: "Việt Nam",
      type: "Home",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  // Mở Modal Chỉnh sửa
  const handleOpenEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({ ...addr });
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    addOrUpdateAddress(formData, editingAddress?.id);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Địa chỉ của tôi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              {addresses.length} Địa chỉ
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Quản lý địa chỉ giao hàng và thanh toán để đặt hàng nhanh chóng hơn.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon="fa-solid fa-plus"
          iconPosition="left"
          onClick={handleOpenAddModal}
          disabled={isUpdating}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      {/* Grid Danh sách địa chỉ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`rounded-xl overflow-hidden bg-white shadow-xs flex flex-col justify-between transition relative border-2 ${
              addr.isDefault
                ? "border-emerald-500"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Mặc định
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                    {addr.type === "Home" ? "Nhà Riêng" : "Cơ Quan / Văn Phòng"}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <h3 className="text-sm font-bold text-slate-900">
                  {addr.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {addr.phone}
                </p>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 leading-relaxed pt-1">
                <p>{addr.street}</p>
                <p>{addr.city}</p>
                <p className="text-slate-400">{addr.country}</p>
              </div>
            </div>

            {/* Bottom Card Actions */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              {addr.isDefault ? (
                <span className="text-xs text-emerald-700 font-semibold">
                  Địa chỉ mặc định
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setDefaultAddress(addr.id)}
                  disabled={isUpdating}
                  className="text-xs font-semibold text-slate-600 hover:text-emerald-600 transition cursor-pointer disabled:opacity-50"
                >
                  Thiết lập mặc định
                </button>
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(addr)}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square text-slate-500" />
                  Sửa
                </button>
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => deleteAddress(addr.id)}
                    disabled={isUpdating}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Slot Thêm Địa Chỉ Mới */}
        <div
          onClick={handleOpenAddModal}
          className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50 hover:bg-slate-100 hover:border-emerald-500 transition cursor-pointer flex flex-col items-center justify-center text-center group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-500 transition shadow-xs mb-3">
            <i className="fa-solid fa-plus text-lg" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition">
            Thêm địa chỉ giao hàng mới
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
            Thêm địa chỉ giao hàng hoặc thanh toán để thuận tiện khi mua hàng
          </p>
        </div>
      </div>

      {/* MODAL POPUP CẬP NHẬT / THÊM ĐỊA CHỈ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingAddress ? "Cập nhật địa chỉ" : "Địa chỉ mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tỉnh/Thành phố, Quận/Huyện
                </label>
                <input
                  type="text"
                  required
                  placeholder="Quận Cầu Giấy, Hà Nội"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ cụ thể (Tên đường, Số nhà)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Số 123 Đường Xuân Thủy, Căn hộ 4B"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Loại địa chỉ
                </label>
                <div className="flex gap-3">
                  {["Home", "Work / Office"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        formData.type === t
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t === "Home" ? "Nhà Riêng" : "Cơ Quan / Văn Phòng"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="defaultCheck"
                  className="text-xs font-medium text-slate-700 cursor-pointer"
                >
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Đang lưu..." : "Hoàn thành"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
