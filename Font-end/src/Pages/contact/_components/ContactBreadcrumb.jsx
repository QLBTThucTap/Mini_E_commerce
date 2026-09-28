import Breadcrumb from "../../../Components/common/Breadcrumb";

export default function ContactBreadcrumb() {
  return (
    <Breadcrumb
      variant="slash"
      items={[
        { label: "Sản phẩm", to: "/products" },
        { label: "Liên hệ" },
      ]}
    />
  );
}
