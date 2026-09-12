import Instance from "./http";

// Khách hàng hoặc người dùng tạo đơn hàng
export async function createOrder(data) {
  const response = await Instance.post("/orders", data);
  return response.data;
}

// Admin lấy toàn bộ đơn hàng trong hệ thống
export async function getAllOrders() {
  const response = await Instance.get("/orders");
  return response.data;
}

// Lấy lịch sử đơn hàng của 1 user (chính chủ hoặc admin)
export async function getOrdersByUser(userId) {
  const response = await Instance.get(`/orders/user/${userId}`);
  return response.data;
}

// Admin tạo đơn hàng thủ công
export async function createOrderByAdmin(data) {
  const response = await Instance.post("/orders/admin", data);
  return response.data;
}

// Admin sửa toàn bộ đơn hàng
export async function updateOrder(id, data) {
  const response = await Instance.put(`/orders/${id}`, data);
  return response.data;
}

// Admin cập nhật trạng thái đơn hàng
export async function updateOrderStatus(id, status) {
  const response = await Instance.patch(`/orders/${id}/status`, { status });
  return response.data;
}

export async function deleteOrder(id) {
  const response = await Instance.delete(`/orders/${id}`);
  return response.data;
}