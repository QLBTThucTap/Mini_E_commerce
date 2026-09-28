import { toast } from "react-toastify";

export default function NewsletterForm({
  placeholder = "Nhập địa chỉ email của bạn",
  buttonLabel = "ĐĂNG KÝ",
  onSubmit,
  dark = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
      return;
    }
    const form = e.currentTarget;
    const emailInput = form.querySelector("input[type='email']");
    const email = emailInput?.value?.trim();
    if (!email) {
      toast.warn("Vui lòng nhập địa chỉ email của bạn!");
      return;
    }
    toast.success("Cảm ơn bạn đã đăng ký nhận bản tin khuyến mãi!");
    if (emailInput) emailInput.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        "flex items-center border-b-2 pb-1 transition-colors",
        dark
          ? "border-slate-700 focus-within:border-emerald-500"
          : "border-slate-200 focus-within:border-emerald-600",
      ].join(" ")}
    >
      <input
        type="email"
        placeholder={placeholder}
        className={[
          "w-full border-0 bg-transparent px-0 py-2 text-xs focus:ring-0 focus:outline-none",
          dark
            ? "text-white placeholder-slate-500"
            : "text-slate-800 placeholder-slate-400",
        ].join(" ")}
      />
      <button
        type="submit"
        className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 tracking-wider uppercase px-2 py-2 whitespace-nowrap"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
