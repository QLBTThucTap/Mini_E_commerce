import { useState } from "react";
import Button from "../../../Components/ui/Button";
import Input from "../../../Components/ui/Input";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "Vietnam",
  subject: "",
  message: "",
  agreeTerms: false,
};

export default function ContactForm({ onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) {
      errs.firstName = "Vui lòng nhập Tên (First Name)";
    }
    if (!formData.lastName.trim()) {
      errs.lastName = "Vui lòng nhập Họ (Last Name)";
    }
    if (!formData.email.trim()) {
      errs.email = "Vui lòng nhập địa chỉ Email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Email không hợp lệ";
    }
    if (
      formData.phone.trim() &&
      !/^[0-9+()\s-]{8,15}$/.test(formData.phone.trim())
    ) {
      errs.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.message.trim()) {
      errs.message = "Vui lòng nhập nội dung tin nhắn";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Nội dung tin nhắn tối thiểu 10 ký tự";
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = "Vui lòng đồng ý với điều khoản dịch vụ";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate async submission with network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      if (onSuccess) {
        onSuccess(
          `Cảm ơn ${formData.firstName}! Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi trong vòng 24 giờ.`
        );
      }
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* First & Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            id="firstName"
            name="firstName"
            label="First Name *"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            autoComplete="given-name"
          />
        </div>
        <div>
          <Input
            id="lastName"
            name="lastName"
            label="Last Name *"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Email Address */}
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address *"
          placeholder="your.email@example.com"
          icon="fa-solid fa-envelope"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      {/* Phone Number */}
      <div>
        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone Number (Optional)"
          placeholder="+84 987 654 321"
          icon="fa-solid fa-phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      {/* Country & Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="country"
            className="block text-xs font-bold text-slate-700"
          >
            Country / Region *
          </label>
          <div className="relative">
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none pr-8 cursor-pointer"
            >
              <option value="Vietnam">Vietnam (VN)</option>
              <option value="United States">United States (US)</option>
              <option value="United Kingdom">United Kingdom (UK)</option>
              <option value="Japan">Japan (JP)</option>
              <option value="Singapore">Singapore (SG)</option>
              <option value="Other">Other Country</option>
            </select>
            <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <Input
            id="subject"
            name="subject"
            label="Subject (Optional)"
            placeholder="Hỗ trợ kỹ thuật / Tư vấn đơn hàng"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="block text-xs font-bold text-slate-700"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Nhập nội dung câu hỏi, đóng góp ý kiến hoặc thông tin cần hỗ trợ..."
          className={[
            "w-full rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 p-3.5 focus:outline-none focus:ring-2 transition-all resize-y min-h-[120px]",
            errors.message
              ? "border-red-400 focus:ring-red-500/30"
              : "border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-500",
          ].join(" ")}
        />
        {errors.message && (
          <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1">
            <i className="fa-solid fa-circle-exclamation text-[11px]" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      {/* Terms Agreement Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs text-slate-600 leading-relaxed">
            Tôi đồng ý với{" "}
            <a
              href="#terms"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Điều khoản & Chính sách bảo mật
            </a>
            . Tôi muốn nhận các thông báo và ưu đãi công nghệ định kỳ.
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1 pl-6">
            <i className="fa-solid fa-circle-exclamation text-[11px]" />
            <span>{errors.agreeTerms}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          icon="fa-solid fa-paper-plane"
          iconPosition="right"
          className="w-full sm:w-auto px-8 py-3 rounded-xl uppercase tracking-wider text-xs font-extrabold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          SEND MESSAGE
        </Button>
      </div>
    </form>
  );
}
