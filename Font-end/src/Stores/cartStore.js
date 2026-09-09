import { persist } from "zustand/middleware";
import { create } from "zustand";
const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existedItem = state.items.find(
            (item) => item.id === product.id,
          );
          if (existedItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: Number(product.price),
                image: product.image,
                quantity,
              },
            ],
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== productId)
              : state.items.map((item) =>
                  item.id === productId ? { ...item, quantity } : item,
                ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      cleanCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
