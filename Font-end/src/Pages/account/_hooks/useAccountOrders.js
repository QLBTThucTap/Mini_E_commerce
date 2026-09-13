import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../../Stores/authStore";
import { getOrdersByUser } from "../../../Services/orderService";
import { getProducts } from "../../../Services/productService";

export function useAccountOrders(activeTab) {
  const user = useAuthStore((state) => state.user);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: orders,
    isLoading: loadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: () => getOrdersByUser(user.id),
    enabled: activeTab === "orders" && Boolean(user?.id),
  });

  const { data: productData } = useQuery({
    queryKey: ["account-products-map"],
    queryFn: () => getProducts({ page: 1, pageSize: 1000 }),
    enabled: activeTab === "orders",
  });

  const productMap = useMemo(
    () => new Map((productData?.items ?? []).map((p) => [p.id, p])),
    [productData]
  );

  const rawOrders = useMemo(() => orders ?? [], [orders]);

  // Đếm số lượng đơn hàng theo từng trạng thái
  const counts = useMemo(() => {
    const res = { all: rawOrders.length, pending: 0, shipping: 0, delivered: 0, cancelled: 0 };
    rawOrders.forEach((order) => {
      const st = order.status || "pending";
      if (res[st] !== undefined) {
        res[st] += 1;
      }
    });
    return res;
  }, [rawOrders]);

  // Lọc danh sách đơn hàng
  const filteredOrders = useMemo(() => {
    let list = [...rawOrders];

    // Lọc theo Status Tab
    if (statusFilter !== "all") {
      list = list.filter((order) => (order.status || "pending") === statusFilter);
    }

    // Lọc theo từ khóa (Mã đơn hàng hoặc Tên sản phẩm)
    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      list = list.filter((order) => {
        const matchId = String(order.id).toLowerCase().includes(keyword);
        const matchProduct = (order.products || []).some((item) => {
          const product = productMap.get(Number(item.productId));
          const title = item.title || product?.title || "";
          return title.toLowerCase().includes(keyword);
        });
        return matchId || matchProduct;
      });
    }

    // Sắp xếp đơn hàng mới nhất lên đầu
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [rawOrders, statusFilter, searchTerm, productMap]);

  return {
    orders: filteredOrders,
    loadingOrders,
    ordersError,
    productMap,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    counts,
    totalOrders: rawOrders.length,
  };
}