import Card from "../ui/Card";
import Badge from "../ui/Badge";
import PriceTag from "../ui/PriceTag";
import StockStatus from "../ui/StockStatus";

/**
 * product: {
 *   id, name, image, reviewCount,
 *   price, compareAtPrice, priceMax,       // priceMax => shows a range instead
 *   badge: { tone, label },                 // e.g. { tone: "sale", label: "SAVE $199" }
 *   tags: string[],                         // e.g. ["FREE SHIPPING", "FREE GIFT"]
 *   stockStatus: "in_stock" | "out_of_stock" | "pre_order",
 *   isWishlisted: boolean,
 * }
 */
export default function ProductCard({ product, onAddToWishlist, onClick }) {
  const {
    name,
    image,
    reviewCount,
    price,
    compareAtPrice,
    priceMax,
    badge,
    tags = [],
    stockStatus = "in_stock",
    isWishlisted = false,
  } = product;

  return (
    <Card
      hoverable
      className="flex flex-col justify-between group cursor-pointer"
      onClick={onClick}
    >
      <div>
        <div className="relative bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[160px] mb-3">
          {badge && (
            <span className="absolute top-2 left-2">
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist?.(product);
            }}
            className={[
              "absolute top-2 right-2 transition-colors",
              isWishlisted
                ? "text-red-500"
                : "text-slate-400 hover:text-red-500",
            ].join(" ")}
          >
            <i
              className={
                isWishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"
              }
            />
          </button>
          {image ? (
            <img
              src={image}
              alt={name}
              className="max-h-[140px] object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="text-5xl text-black group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-box" />
            </div>
          )}
        </div>

        {typeof reviewCount === "number" && (
          <div className="text-[11px] text-slate-400 font-medium mb-1">
            ({reviewCount})
          </div>
        )}
        <h5 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
          {name}
        </h5>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        <PriceTag
          price={price}
          compareAtPrice={compareAtPrice}
          priceMax={priceMax}
        />
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} tone="success" className="normal-case">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <StockStatus status={stockStatus} />
      </div>
    </Card>
  );
}
