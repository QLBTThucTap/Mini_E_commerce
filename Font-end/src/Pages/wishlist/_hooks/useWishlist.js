import { useState, useMemo, useCallback } from "react";
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

  const [toastMessage, setToastMessage] = useState(null);
  const [addedItemIds, setAddedItemIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

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

      showToast(`Đã thêm "${item.title || item.name}" vào giỏ hàng!`);
    },
    [addItemToCart, showToast],
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

    showToast(`Đã thêm tất cả ${items.length} sản phẩm vào giỏ hàng!`);
  }, [items, addItemToCart, showToast]);

  // Xóa 1 sản phẩm khỏi danh sách yêu thích
  const handleRemoveItem = useCallback(
    (item) => {
      removeItem(item.id);
      showToast(`Đã gỡ "${item.title || item.name}" khỏi danh sách yêu thích`);
    },
    [removeItem, showToast],
  );

  // Xóa tất cả sản phẩm trong wishlist
  const handleClearAll = useCallback(() => {
    clearWishlist();
    showToast("Đã làm trống danh sách yêu thích");
  }, [clearWishlist, showToast]);

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
    toastMessage,
    addedItemIds,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    showToast,
    handleAddToCart,
    handleAddAllToCart,
    handleRemoveItem,
    handleClearAll,
  };
}
