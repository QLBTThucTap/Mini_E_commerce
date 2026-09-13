import Card from "../ui/Card";
import Badge from "../ui/Badge";
import PriceTag from "../ui/PriceTag";
import StockStatus from "../ui/StockStatus";
import Button from "../ui/Button";
import useWishlistStore from "../../Stores/wishlistStore";

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
export default function ProductCard({
  product,
  onAddToWishlist,
  onAddToCart,
  onClick,
}) {
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlistStore = useWishlistStore((state) =>
    state.items.some((item) => item.id === product.id),
  );

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
    isWishlisted,
  } = product;

  const isFav = isWishlisted !== undefined ? isWishlisted : isInWishlistStore;

  return (
    <Card
      hoverable
      className="flex flex-col justify-between group cursor-pointer h-full"
      onClick={onClick}
    >
      <div>
        <div className="relative bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[160px] mb-3 overflow-hidden">
          {badge && (
            <span className="absolute top-2 left-2 z-10 pointer-events-none">
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </span>
          )}

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
        <h5 className=" min-h-[2.5rem] text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
          {name}
        </h5>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <PriceTag
            price={price}
            compareAtPrice={compareAtPrice}
            priceMax={priceMax}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToWishlist) {
                onAddToWishlist(product);
              } else {
                toggleWishlist(product.original || product);
              }
            }}
            className={[
              "p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer",
              isFav ? "text-rose-500" : "text-slate-400 hover:text-rose-500",
            ].join(" ")}
            title={
              isFav
                ? "Xóa khỏi danh sách yêu thích"
                : "Thêm vào danh sách yêu thích"
            }
          >
            <i
              className={[
                "text-base transition-transform active:scale-125",
                isFav ? "fa-solid fa-heart" : "fa-regular fa-heart",
              ].join(" ")}
            />
          </button>
        </div>

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

      <Button
        variant="primary"
        size="sm"
        className="w-full mt-2 cursor-pointer"
        icon="fa-solid fa-cart-shopping"
        iconPosition="left"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart?.(product);
        }}
      >
        Add to Cart
      </Button>
    </Card>
  );
}
