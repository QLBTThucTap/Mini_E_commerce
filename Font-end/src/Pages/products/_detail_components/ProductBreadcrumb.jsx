import Breadcrumb from "../../../Components/common/Breadcrumb";

const CATEGORY_NAMES = {
  laptop: "Laptops & Computers",
  phone: "Cell Phones & Tablets",
  headphone: "Audio & Headphones",
  keyboard: "Gaming Gear & Keyboards",
  mouse: "Mice & Accessories",
};

export default function ProductBreadcrumb({ product }) {
  if (!product) return null;

  const categoryName =
    CATEGORY_NAMES[product.category] ||
    (product.category ? product.category.toUpperCase() : "Cell Phones & Tablets");

  const items = [{ label: "Shop", to: "/products" }];

  if (product.category) {
    items.push({
      label: categoryName,
      to: `/products?category=${product.category}`,
      className: "text-slate-700 font-bold",
    });
  }

  items.push({
    label: product.title || product.name,
    className: "text-slate-900 font-extrabold line-clamp-1 max-w-xs sm:max-w-md",
  });

  return (
    <Breadcrumb
      variant="chevron"
      homeLabel="TRANG CHỦ"
      className="mb-6 sm:mb-8"
      items={items}
      rightContent={
        <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs">
          <span>SKU:</span>
          <strong className="text-slate-700 uppercase">
            TECH-{String(product.id).padStart(5, "0")}
          </strong>
        </div>
      }
    />
  );
}
