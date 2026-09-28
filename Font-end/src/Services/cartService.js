import Instance from "./http";

export const transformServerCartToItems = (serverCart) => {
  if (!serverCart || !Array.isArray(serverCart.products)) return [];
  return serverCart.products
    .map((item) => {
      const product = item.product || {};
      const id = Number(item.productId || product.id);
      return {
        id,
        title: product.title || product.name || item.title || `Sản phẩm #${id}`,
        price: Number(
          product.price !== undefined ? product.price : item.price || 0,
        ),
        image: product.image || item.image || "",
        quantity: Number(item.quantity) || 1,
      };
    })
    .filter((item) => !isNaN(item.id) && item.id > 0);
};

export const cartService = {
  // Lấy giỏ hàng đang active của user
  getActiveCart: async () => {
    const response = await Instance.get("carts/active");
    return response.data;
  },

  // Hợp nhất (Merge) giỏ hàng guest lên server sau khi login
  mergeCart: async (items) => {
    const response = await Instance.post("carts/merge", { items });
    return response.data;
  },

  // Thêm sản phẩm vào giỏ trên server
  addItem: async (productId, quantity = 1) => {
    const response = await Instance.post("carts/active/items", {
      productId: Number(productId),
      quantity: Number(quantity),
    });
    return response.data;
  },

  // Cập nhật số lượng sản phẩm trên server
  updateQuantity: async (productId, quantity) => {
    const response = await Instance.patch(`carts/active/items/${productId}`, {
      quantity: Number(quantity),
    });
    return response.data;
  },

  // Xóa 1 sản phẩm khỏi giỏ trên server
  removeItem: async (productId) => {
    const response = await Instance.delete(`carts/active/items/${productId}`);
    return response.data;
  },

  // Xóa sạch giỏ hàng trên server
  clearCart: async () => {
    const response = await Instance.delete("carts/active");
    return response.data;
  },
};

export default cartService;
