import Breadcrumb from "../../../Components/common/Breadcrumb";

export default function WishlistBreadcrumb({ count = 0 }) {
  return (
    <Breadcrumb
      variant="chevron"
      items={[{ label: "Danh sách yêu thích" }]}
      rightContent={
        <span className="text-slate-500 hidden sm:inline">
          Tổng cộng: <strong className="text-slate-800">{count}</strong> sản phẩm
        </span>
      }
    />
  );
}
