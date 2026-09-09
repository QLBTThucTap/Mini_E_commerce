const STATUS_MAP = {
  in_stock: {
    label: "In Stock",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
  },
  out_of_stock: {
    label: "Out of stock",
    dot: "bg-red-400",
    text: "text-red-500",
  },
  pre_order: {
    label: "Pre-Order",
    dot: "bg-amber-400",
    text: "text-amber-600",
  },
};

export default function StockStatus({
  status = "in_stock",
  label,
  className = "",
}) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.in_stock;
  return (
    <div
      className={[
        "flex items-center gap-1 text-[10px] font-semibold",
        cfg.text,
        className,
      ].join(" ")}
    >
      <span className={["w-1.5 h-1.5 rounded-full", cfg.dot].join(" ")} />
      <span>{label ?? cfg.label}</span>
    </div>
  );
}
