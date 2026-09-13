/**
 * Định dạng tiền tệ USD
 */
export function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
}

/**
 * Tính toán thống kê tổng quan của danh sách yêu thích
 */
export function calculateWishlistSummary(items = []) {
  const totalCount = items.length;
  const totalPrice = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );
  const inStockCount = items.filter(
    (item) => !item.stockStatus || item.stockStatus === "in_stock",
  ).length;

  return {
    totalCount,
    totalPrice,
    inStockCount,
    formattedTotalPrice: formatMoney(totalPrice),
  };
}

/**
 * Lọc và sắp xếp danh sách yêu thích theo từ khóa và tiêu chí
 */
export function filterAndSortWishlistItems(items = [], searchTerm = "", sortBy = "default") {
  let result = [...items];

  // Lọc theo từ khóa tìm kiếm
  const keyword = searchTerm.trim().toLowerCase();
  if (keyword) {
    result = result.filter((item) => {
      const title = (item.title || item.name || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      return title.includes(keyword) || category.includes(keyword);
    });
  }

  // Sắp xếp
  switch (sortBy) {
    case "price_asc":
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      break;
    case "price_desc":
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      break;
    case "name_asc":
      result.sort((a, b) =>
        (a.title || a.name || "").localeCompare(b.title || b.name || ""),
      );
      break;
    case "default":
    default:
      // Giữ nguyên thứ tự thêm vào
      break;
  }

  return result;
}
