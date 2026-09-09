export default function RatingStars({ value = 5, count, size = "sm" }) {
  const starSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="flex items-center gap-2 text-xs text-amber-500">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <i
            key={i}
            className={[
              i < value ? "fa-solid" : "fa-regular",
              "fa-star",
              starSize,
              i < value ? "" : "text-slate-200",
            ].join(" ")}
          />
        ))}
      </div>

      {typeof count === "number" && (
        <span className="text-slate-400 font-medium">({count} reviews)</span>
      )}
    </div>
  );
}
