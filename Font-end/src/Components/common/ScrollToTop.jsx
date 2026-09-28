import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Tự động cuộn trang lên vị trí đầu (top) mỗi khi chuyển trang / đổi đường dẫn (route)
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Đưa thanh cuộn về đỉnh trang ngay lập tức khi chuyển route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
