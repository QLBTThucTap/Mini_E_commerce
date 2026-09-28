import Breadcrumb from "../../../Components/common/Breadcrumb";

export default function AuthBreadcrumb({ currentLabel = "Authentication" }) {
  return (
    <Breadcrumb
      variant="slash"
      items={[
        { label: "Trang" },
        { label: currentLabel },
      ]}
    />
  );
}
