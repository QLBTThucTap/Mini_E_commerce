import useCartStore from "../Stores/cartStore";
import useWishlistStore from "../Stores/wishlistStore";
import { toast } from "react-toastify";

/**
 * Custom Hook xử lý các thao tác liên quan đến sản phẩm (Thêm giỏ hàng, Yêu thích)
 */
export function useProducts() {
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product, quantity = 1) => {
    if (!product) return;

    // Chuẩn hóa dữ liệu nếu product được truyền từ ProductListPage (có thuộc tính original)
    const itemData = product.original || product;

    addItem(
      {
        id: itemData.id,
        title: itemData.title || itemData.name,
        price: itemData.price,
        image: itemData.image,
      },
      quantity
    );

    const title = itemData.title || itemData.name;
    toast.success(`Đã thêm ${quantity > 1 ? quantity + " " : ""}sản phẩm "${title}" vào giỏ hàng!`);
  };

  // Thêm / Bớt sản phẩm khỏi danh sách yêu thích
  const handleToggleWishlist = (product) => {
    if (!product) return;

    const itemData = product.original || product;
    const title = itemData.title || itemData.name;
    const added = toggleWishlist(itemData);

    if (added) {
      toast.success(`Đã thêm "${title}" vào danh sách yêu thích!`);
    } else {
      toast.info(`Đã xóa "${title}" khỏi danh sách yêu thích.`);
    }
  };

  // Kiểm tra sản phẩm đã nằm trong wishlist chưa
  const checkIsWishlisted = (productId) => {
    if (!productId) return false;
    return wishlistItems.some((item) => item.id === productId);
  };

  return {
    handleAddToCart,
    handleToggleWishlist,
    checkIsWishlisted,
    wishlistItems,
  };
}

export default useProducts;