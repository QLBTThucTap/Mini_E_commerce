import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Thêm sản phẩm vào danh sách yêu thích
      addItem: (product) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) return state;

          const newItem = {
            id: product.id,
            title: product.title || product.name || "Sản phẩm",
            name: product.name || product.title || "Sản phẩm",
            price: Number(product.price) || 0,
            image: product.image || "",
            category: product.category || "",
            description: product.description || "",
            rating: product.rating || { rate: 5, count: 0 },
            stockStatus: product.stockStatus || "in_stock",
          };

          return { items: [...state.items, newItem] };
        }),

      // Xóa sản phẩm khỏi danh sách yêu thích
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      // Bật/tắt trạng thái yêu thích (Toggle)
      toggleItem: (product) => {
        const { items, addItem, removeItem } = get();
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
          removeItem(product.id);
          return false; // đã gỡ bỏ
        } else {
          addItem(product);
          return true; // đã thêm mới
        }
      },

      // Kiểm tra sản phẩm có trong danh sách yêu thích không
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      // Xóa toàn bộ danh sách yêu thích
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    },
  ),
);

export default useWishlistStore;
