import { useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import useWishlistStore from "../../../Stores/wishlistStore";
import useCartStore from "../../../Stores/cartStore";
import {
  calculateWishlistSummary,
  filterAndSortWishlistItems,
} from "../_utils/wishlistUtils";

/**
 * Custom Hook quản lý toàn bộ nghiệp vụ và trạng thái của trang Wishlist
 */
export function useWishlist() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  const addItemToCart = useCartStore((state) => state.addItem);

  const [addedItemIds, setAddedItemIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Thêm 1 sản phẩm vào giỏ hàng
  const handleAddToCart = useCallback(
    (item) => {
      addItemToCart(
        {
          id: item.id,
          title: item.title || item.name,
          price: Number(item.price),
          image: item.image,
        },
        1,
      );

      setAddedItemIds((prev) => new Set(prev).add(item.id));
      setTimeout(() => {
        setAddedItemIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }, 2000);

      toast.success(`Đã thêm "${item.title || item.name}" vào giỏ hàng!`);
    },
    [addItemToCart],
  );

  // Thêm tất cả sản phẩm vào giỏ hàng
  const handleAddAllToCart = useCallback(() => {
    if (items.length === 0) return;

    items.forEach((item) => {
      addItemToCart(
        {
          id: item.id,
          title: item.title || item.name,
          price: Number(item.price),
          image: item.image,
        },
        1,
      );
    });

    toast.success(`Đã thêm tất cả ${items.length} sản phẩm vào giỏ hàng!`);
  }, [items, addItemToCart]);

  // Xóa 1 sản phẩm khỏi danh sách yêu thích
  const handleRemoveItem = useCallback(
    (item) => {
      removeItem(item.id);
      toast.error(
        `Đã gỡ "${item.title || item.name}" khỏi danh sách yêu thích`,
      );
    },
    [removeItem],
  );

  // Xóa tất cả sản phẩm trong wishlist
  const handleClearAll = useCallback(() => {
    clearWishlist();
    toast.error("Đã làm trống danh sách yêu thích");
  }, [clearWishlist]);

  // Thống kê tóm tắt
  const summary = useMemo(() => calculateWishlistSummary(items), [items]);

  // Danh sách đã lọc và sắp xếp
  const displayedItems = useMemo(
    () => filterAndSortWishlistItems(items, searchTerm, sortBy),
    [items, searchTerm, sortBy],
  );

  return {
    items,
    displayedItems,
    summary,
    isEmpty: items.length === 0,
    addedItemIds,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    handleAddToCart,
    handleAddAllToCart,
    handleRemoveItem,
    handleClearAll,
  };
}
