import Breadcrumb from "../../../Components/common/Breadcrumb";

export default function CheckoutBreadcrumb() {
  return (
    <Breadcrumb
      variant="material"
      items={[
        { label: "Giỏ hàng", to: "/cart" },
        { label: "Checkout", className: "text-[#0b1c30] font-bold" },
      ]}
    />
  );
}
