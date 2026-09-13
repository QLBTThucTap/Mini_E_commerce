export function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(val) {
  return `$${Number(val || 0).toFixed(2)}`;
}
