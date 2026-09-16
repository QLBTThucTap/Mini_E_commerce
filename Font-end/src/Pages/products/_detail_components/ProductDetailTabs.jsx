import { useState } from "react";
import RatingStars from "../../../Components/ui/RatingStars";
import Button from "../../../Components/ui/Button";

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Trần Minh Quang",
    date: "14/09/2026",
    rating: 5,
    verified: true,
    content: "Máy giao rất nhanh, đóng gói cẩn thận 3 lớp chống sốc. Dùng cực kỳ mượt mà, màn hình đẹp xuất sắc, pin trâu dùng cả ngày dài không lo hết. Rất hài lòng với dịch vụ của shop!",
  },
  {
    id: 2,
    name: "Nguyễn Thảo Vy",
    date: "10/09/2026",
    rating: 5,
    verified: true,
    content: "Hàng chính hãng nguyên seal, check bảo hành đầy đủ trên hệ thống. Màu titan bên ngoài nhìn sang chảnh hơn trong ảnh nhiều. Tặng kèm củ sạc rất tiện.",
  },
  {
    id: 3,
    name: "Lê Hoàng Nam",
    date: "05/09/2026",
    rating: 4,
    verified: true,
    content: "Chất lượng hoàn thiện cao cấp, hiệu năng chơi game rất tốt không bị nóng máy nhiều. Giao hàng hơi trễ 1 xíu do mưa bão nhưng nhân viên hỗ trợ nhiệt tình.",
  },
];

export default function ProductDetailTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description"); // "description" | "specs" | "reviews" | "shipping"

  // Form review state
  const [newReviewer, setNewReviewer] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReviewer.trim() || !newComment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: newReviewer.trim(),
      date: new Date().toLocaleDateString("vi-VN"),
      rating: Number(newRating),
      verified: true,
      content: newComment.trim(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewer("");
    setNewComment("");
    setNewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  if (!product) return null;

  return (
    <section className="my-10 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex items-center border-b border-slate-200 overflow-x-auto bg-slate-50/50">
        {[
          { id: "description", label: "Mô tả chi tiết", icon: "fa-solid fa-file-lines" },
          { id: "specs", label: "Thông số kỹ thuật", icon: "fa-solid fa-microchip" },
          { id: "reviews", label: `Đánh giá (${reviewsList.length})`, icon: "fa-solid fa-star" },
          { id: "shipping", label: "Chính sách Vận chuyển & Đổi trả", icon: "fa-solid fa-truck-fast" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-emerald-600 text-emerald-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              <i className={`${tab.icon} text-xs ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-6 lg:p-8">
        {/* TAB 1: DESCRIPTION */}
        {activeTab === "description" && (
          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 mb-2">
                Tổng quan sản phẩm {product.title || product.name}
              </h4>
              <p>{product.description}</p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-bolt" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm mb-1">Hiệu năng vượt trội</h5>
                <p className="text-xs text-slate-500">
                  Trang bị vi xử lý thế hệ mới nhất cho tốc độ phản hồi tức thì và tiết kiệm điện năng tối đa.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-gem" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm mb-1">Thiết kế hoàn mỹ</h5>
                <p className="text-xs text-slate-500">
                  Khung viền cao cấp siêu bền nhẹ, các chi tiết được gia công chuẩn xác từng milimet.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-battery-full" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm mb-1">Thời lượng pin bền bỉ</h5>
                <p className="text-xs text-slate-500">
                  Thoải mái làm việc và giải trí suốt ngày dài kèm công nghệ sạc thông minh bảo vệ tuổi thọ pin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICAL SPECIFICATIONS */}
        {activeTab === "specs" && (
          <div className="max-w-3xl">
            <h4 className="text-base font-extrabold text-slate-900 mb-4">
              Bảng thông số kỹ thuật chi tiết
            </h4>
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody>
                  {[
                    { label: "Thương hiệu & Dòng máy", val: product.category?.toUpperCase() || "TECH MART PRO" },
                    { label: "Màn hình", val: "OLED Super Retina XDR, 120Hz ProMotion" },
                    { label: "Bộ vi xử lý (CPU)", val: "Chip Apple Silicon / Snapdragon Gen Series cao cấp" },
                    { label: "Bộ nhớ RAM", val: "8GB / 16GB LPDDR5X đa nhiệm mượt mà" },
                    { label: "Bộ nhớ trong", val: "128GB / 256GB / 512GB / 1TB NVMe" },
                    { label: "Camera", val: "Cảm biến 48MP OIS chống rung quang học, quay phim 4K 60fps" },
                    { label: "Pin & Công nghệ sạc", val: "Hỗ trợ sạc nhanh 45W, sạc không dây chuẩn Qi" },
                    { label: "Chuẩn chống nước & bụi", val: "IP68 tiêu chuẩn quốc tế" },
                    { label: "Hệ điều hành", val: "Phiên bản mới nhất được cập nhật liên tục" },
                    { label: "Trọng lượng", val: "Khoảng 187g - 221g" },
                  ].map((row, index) => (
                    <tr
                      key={row.label}
                      className={index % 2 === 0 ? "bg-slate-50/60" : "bg-white"}
                    >
                      <td className="py-3 px-4 font-bold text-slate-700 w-1/3 border-b border-slate-100">
                        {row.label}
                      </td>
                      <td className="py-3 px-4 text-slate-600 border-b border-slate-100">
                        {row.val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            {/* Điểm tổng quan */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-center sm:border-r sm:border-slate-200 sm:pr-8">
                <div className="text-4xl font-extrabold text-slate-900 leading-none mb-1">
                  4.9
                </div>
                <RatingStars value={5} count={0} size="sm" />
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  Dựa trên {reviewsList.length} đánh giá
                </p>
              </div>

              {/* Progress bars */}
              <div className="flex-1 w-full space-y-1.5 text-xs font-semibold text-slate-600">
                {[
                  { star: "5 sao", pct: "88%" },
                  { star: "4 sao", pct: "9%" },
                  { star: "3 sao", pct: "3%" },
                  { star: "2 sao", pct: "0%" },
                  { star: "1 sao", pct: "0%" },
                ].map((s) => (
                  <div key={s.star} className="flex items-center gap-3">
                    <span className="w-10 shrink-0">{s.star}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: s.pct }} />
                    </div>
                    <span className="w-8 text-right text-slate-400">{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh sách bình luận */}
            <div className="space-y-4">
              <h5 className="font-extrabold text-sm text-slate-900">
                Nhận xét từ khách hàng
              </h5>
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                        {rev.name.charAt(0)}
                      </span>
                      <div>
                        <span className="font-bold text-xs text-slate-800">{rev.name}</span>
                        {rev.verified && (
                          <span className="ml-2 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                            ✓ Đã mua hàng
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <RatingStars value={rev.rating} count={0} size="sm" />
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
                </div>
              ))}
            </div>

            {/* Form gửi đánh giá mới */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h5 className="font-extrabold text-sm text-slate-900 mb-3">
                Viết đánh giá của bạn
              </h5>
              <form onSubmit={handleSubmitReview} className="space-y-3 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đánh giá chất lượng:
                  </label>
                  <div className="flex items-center gap-2">
                    {[5, 4, 3, 2, 1].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setNewRating(st)}
                        className={`px-3 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                          newRating === st
                            ? "bg-amber-400 border-amber-500 text-slate-900"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {st} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên của bạn:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hoàng Long"
                    value={newReviewer}
                    onChange={(e) => setNewReviewer(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nhận xét chi tiết:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <Button type="submit" variant="primary" size="sm">
                  Gửi đánh giá
                </Button>

                {reviewSuccess && (
                  <p className="text-xs font-bold text-emerald-600 mt-2">
                    ✓ Cảm ơn bạn! Đánh giá đã được gửi thành công.
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: SHIPPING & RETURNS */}
        {activeTab === "shipping" && (
          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h5 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-truck text-emerald-600" />
                <span>Chính sách giao hàng</span>
              </h5>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Giao hàng hỏa tốc trong 2 giờ tại khu vực nội thành Hà Nội & TP. Hồ Chí Minh.</li>
                <li>Giao hàng toàn quốc từ 1 - 3 ngày làm việc qua các đối tác uy tín (Viettel Post, GHN).</li>
                <li>Miễn phí 100% cước vận chuyển cho các đơn hàng có giá trị từ <strong>$199</strong> trở lên.</li>
                <li>Được kiểm tra hàng trước khi thanh toán và ký nhận.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h5 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-rotate text-emerald-600" />
                <span>Chính sách đổi trả & Hoàn tiền trong 30 ngày</span>
              </h5>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Lỗi phần cứng từ nhà sản xuất: Đổi mới 1 - 1 ngay lập tức trong 30 ngày đầu tiên.</li>
                <li>Sản phẩm đổi trả phải còn nguyên tem bảo hành, hộp đựng và phụ kiện kèm theo ban đầu.</li>
                <li>Bảo hành chính hãng 12 - 24 tháng theo tiêu chuẩn của nhà sản xuất tại các trung tâm ủy quyền toàn quốc.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
