export default function BillingForm({ formData, errors, onChange }) {
  return (
    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
          Billing & Shipping Details
        </h2>
        <p className="text-xs sm:text-sm text-[#565e74] mt-1">
          Vui lòng cung cấp chính xác địa chỉ và số điện thoại để đảm bảo giao hàng nhanh chóng.
        </p>
      </div>

      <div className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0b1c30]">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              placeholder="e.g. Huyền"
              className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                errors.firstName ? "border-red-500" : "border-transparent"
              } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
            />
            {errors.firstName && (
              <span className="text-xs text-red-500">{errors.firstName}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0b1c30]">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              placeholder="e.g. Lã Ngọc"
              className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                errors.lastName ? "border-red-500" : "border-transparent"
              } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
            />
            {errors.lastName && (
              <span className="text-xs text-red-500">{errors.lastName}</span>
            )}
          </div>
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#0b1c30]">
            Company Name (Optional)
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={onChange}
            placeholder="e.g. SWOO Tech Vietnam LLC"
            className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all"
          />
        </div>

        {/* Country / Region */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#0b1c30]">
            Country / Region <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={onChange}
            className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all cursor-pointer"
          >
            <option value="VN">Vietnam (VN)</option>
            <option value="US">United States (US)</option>
            <option value="JP">Japan (JP)</option>
            <option value="KR">South Korea (KR)</option>
            <option value="SG">Singapore (SG)</option>
          </select>
        </div>

        {/* Street Address */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#0b1c30]">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={onChange}
            placeholder="Số nhà, tên đường, thôn xóm / phố"
            className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
              errors.streetAddress ? "border-red-500" : "border-transparent"
            } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
          />
          {errors.streetAddress && (
            <span className="text-xs text-red-500">{errors.streetAddress}</span>
          )}
          <input
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={onChange}
            placeholder="Căn hộ, số phòng, tòa nhà (tùy chọn)"
            className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all"
          />
        </div>

        {/* Town / City, State / County, Postcode / ZIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0b1c30]">
              Town / City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              placeholder="Hà Nội"
              className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                errors.city ? "border-red-500" : "border-transparent"
              } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
            />
            {errors.city && (
              <span className="text-xs text-red-500">{errors.city}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0b1c30]">
              State / County
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={onChange}
              placeholder="Quận Hai Bà Trưng"
              className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0b1c30]">
              Postcode / ZIP
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={onChange}
              placeholder="100000"
              className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all"
            />
          </div>
        </div>

        {/* Phone Number & Email Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0b1c30]">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="0824781531"
              className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                errors.phone ? "border-red-500" : "border-transparent"
              } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
            />
            {errors.phone && (
              <span className="text-xs text-red-500">{errors.phone}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0b1c30]">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="contact@swootechmart.com"
              className={`bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-sm text-[#0b1c30] border ${
                errors.email ? "border-red-500" : "border-transparent"
              } focus:outline-none focus:bg-white focus:border-[#006948] transition-all`}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </div>
        </div>

        {/* Save information checkbox */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="save-info"
            name="saveInfo"
            checked={formData.saveInfo}
            onChange={onChange}
            className="w-4 h-4 rounded text-[#006948] focus:ring-[#006948] accent-[#006948] cursor-pointer"
          />
          <label
            htmlFor="save-info"
            className="text-xs text-[#0b1c30] cursor-pointer select-none font-medium"
          >
            Lưu thông tin giao hàng cho lần thanh toán nhanh tiếp theo
          </label>
        </div>

        {/* Order Notes */}
        <div className="pt-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#0b1c30]">
            Order Notes & Delivery Instructions (Optional)
          </label>
          <textarea
            rows={3}
            name="orderNotes"
            value={formData.orderNotes}
            onChange={onChange}
            placeholder="Ghi chú thêm về đơn hàng (ví dụ: giờ giao hàng thuận tiện, gọi điện trước khi đến, hướng dẫn gửi hàng bảo vệ)..."
            className="bg-[#eff4ff] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#0b1c30] border border-transparent focus:outline-none focus:bg-white focus:border-[#006948] transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
