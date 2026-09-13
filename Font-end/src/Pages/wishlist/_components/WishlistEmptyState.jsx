import { Link, useNavigate } from "react-router-dom";
import Button from "../../../Components/ui/Button";

export default function WishlistEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 sm:p-16 text-center max-w-xl mx-auto my-8 shadow-xs">
      <div className="w-20 h-20 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl shadow-inner">
        <i className="fa-regular fa-heart" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">
        Danh sách yêu thích của bạn đang trống
      </h2>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
        Hãy bấm vào biểu tượng trái tim ở bất kỳ sản phẩm nào để lưu lại danh sách các món đồ bạn yêu thích và theo dõi giá dễ dàng!
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          icon="fa-solid fa-bag-shopping"
          onClick={() => navigate("/products")}
          className="cursor-pointer"
        >
          Khám phá sản phẩm ngay
        </Button>
        <Link
          to="/"
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors inline-flex items-center gap-2"
        >
          <i className="fa-solid fa-house text-xs" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
