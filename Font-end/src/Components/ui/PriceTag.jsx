const TONE_CLASSES = {
  default: "text-slate-900",
  sale: "text-emerald-600",
  discount: "text-red-600",
};

function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export default function PriceTag({
  price,
  compareAtPrice,
  priceMax,
  tone = "default",
  size = "md",
  className = "",
}) {
  const sizeClass = { sm: "text-xs", md: "text-sm", lg: "text-3xl" }[size];
  if (priceMax) {
    <div
      className={[
        "font-black",
        sizeClass,
        TONE_CLASSES.default,
        className,
      ].join(" ")}
    >
      {formatCurrency(price)} - {formatCurrency(priceMax)}
    </div>;
  }

  return (
    <div className={["flex items-baseline gap-1.5", className].join(" ")}>
      <span className={["font-black", sizeClass, TONE_CLASSES[tone]].join(" ")}>
        {formatCurrency(price)}
      </span>
      {compareAtPrice && (
        <span className="text-xs font-semibold text-slate-400 line-through">
          {formatCurrency(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
