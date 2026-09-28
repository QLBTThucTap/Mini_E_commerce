import { persist } from "zustand/middleware";
import { create } from "zustand";
import useAuthStore from "./authStore";
import cartService, { transformServerCartToItems } from "../Services/cartService";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Cập nhật toàn bộ danh sách items
      setItems: (items) => set({ items: Array.isArray(items) ? items : [] }),

      // Thêm sản phẩm vào giỏ hàng
      addItem: (product, quantity = 1) => {
        const qty = Number(quantity) || 1;
        const productId = Number(product.id);

        set((state) => {
          const existedItem = state.items.find((item) => item.id === productId);
          if (existedItem) {
            return {
              items: state.items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: item.quantity + qty }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: productId,
                title: product.title || product.name || `Sản phẩm #${productId}`,
                price: Number(product.price || 0),
                image: product.image || "",
                quantity: qty,
              },
            ],
          };
        });

        // Nếu đã đăng nhập, đồng bộ lên server trong background
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          cartService.addItem(productId, qty).catch((err) => {
            console.error("Lỗi đồng bộ thêm sản phẩm lên server:", err);
          });
        }
      },

      // Cập nhật số lượng sản phẩm
      updateQuantity: (productId, quantity) => {
        const targetId = Number(productId);
        const qty = Number(quantity);

        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((item) => item.id !== targetId)
              : state.items.map((item) =>
                  item.id === targetId ? { ...item, quantity: qty } : item,
                ),
        }));

        // Nếu đã đăng nhập, đồng bộ lên server trong background
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          if (qty <= 0) {
            cartService.removeItem(targetId).catch((err) => {
              console.error("Lỗi xóa sản phẩm trên server:", err);
            });
          } else {
            cartService.updateQuantity(targetId, qty).catch((err) => {
              console.error("Lỗi cập nhật số lượng trên server:", err);
            });
          }
        }
      },

      // Xóa 1 sản phẩm khỏi giỏ hàng
      removeItem: (productId) => {
        const targetId = Number(productId);

        set((state) => ({
          items: state.items.filter((item) => item.id !== targetId),
        }));

        // Nếu đã đăng nhập, đồng bộ xóa trên server
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          cartService.removeItem(targetId).catch((err) => {
            console.error("Lỗi xóa sản phẩm trên server:", err);
          });
        }
      },

      // Xóa toàn bộ sản phẩm trong giỏ hàng
      cleanCart: (syncServer = true) => {
        set({ items: [] });

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (syncServer && isAuthenticated) {
          cartService.clearCart().catch((err) => {
            console.error("Lỗi làm trống giỏ hàng trên server:", err);
          });
        }
      },

      // Clear sạch giỏ hàng Store & localStorage khi đăng xuất (KHÔNG xóa data trên server)
      resetCart: () => {
        set({ items: [] });
        try {
          localStorage.removeItem("cart-storage");
        } catch (e) {
          console.error("Lỗi xóa cart-storage trong localStorage:", e);
        }
      },

      // Tải giỏ hàng từ server về store (dùng khi F5 khôi phục phiên đăng nhập)
      fetchServerCart: async () => {
        try {
          const res = await cartService.getActiveCart();
          const items = transformServerCartToItems(res);
          set({ items });
          return items;
        } catch (err) {
          console.error("Lỗi khi tải giỏ hàng từ server:", err);
        }
      },

      // Hợp nhất (Merge) giỏ hàng Guest (localStorage) với Database sau khi đăng nhập
      syncCartOnLogin: async () => {
        const guestItems = get().items || [];

        try {
          let serverCart;
          if (guestItems.length > 0) {
            // Gửi guest items lên server để merge
            serverCart = await cartService.mergeCart(
              guestItems.map((item) => ({
                productId: Number(item.id),
                quantity: Number(item.quantity),
              })),
            );
          } else {
            // Không có guest items, lấy giỏ hàng hiện có của user từ DB
            serverCart = await cartService.getActiveCart();
          }

          // Chuyển đổi và lưu giỏ hàng mới nhất vào Zustand Store (và localStorage)
          const mergedItems = transformServerCartToItems(serverCart);
          set({ items: mergedItems });
          return mergedItems;
        } catch (error) {
          console.error("Lỗi khi merge giỏ hàng khi đăng nhập:", error);
        }
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
