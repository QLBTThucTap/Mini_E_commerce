import Breadcrumb from "../../../Components/common/Breadcrumb";

export default function AboutBreadcrumb() {
  return (
    <Breadcrumb
      variant="slash"
      items={[
        { label: "Trang" },
        { label: "Về chúng tôi" },
      ]}
    />
  );
}
