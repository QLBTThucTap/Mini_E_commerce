import { Link } from "react-router-dom";

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

  return (
    <nav className="bg-[#eff4ff] py-3.5 border-b border-slate-200/80 mb-6 sm:mb-8">
      <div className="max-w-[1360px] mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/"
            className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-slate-600"
          >
            <i className="fa-solid fa-house text-[11px]" />
            <span>Home</span>
          </Link>

          <i className="fa-solid fa-chevron-right text-[9px] text-slate-400" />

          <Link
            to="/products"
            className="hover:text-emerald-600 transition-colors text-slate-600"
          >
            Shop
          </Link>

          {product.category && (
            <>
              <i className="fa-solid fa-chevron-right text-[9px] text-slate-400" />
              <Link
                to={`/products?category=${product.category}`}
                className="hover:text-emerald-600 transition-colors text-slate-700 font-bold"
              >
                {categoryName}
              </Link>
            </>
          )}

          <i className="fa-solid fa-chevron-right text-[9px] text-slate-400" />
          <span className="text-slate-900 font-extrabold line-clamp-1 max-w-xs sm:max-w-md">
            {product.title || product.name}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs">
          <span>SKU:</span>
          <strong className="text-slate-700 uppercase">
            TECH-{String(product.id).padStart(5, "0")}
          </strong>
        </div>
      </div>
    </nav>
  );
}
