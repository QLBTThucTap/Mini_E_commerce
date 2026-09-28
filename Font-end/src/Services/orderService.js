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

// Admin xuất hóa đơn PDF
export async function exportOrderInvoices(orderIds) {
  const response = await Instance.post(
    "/orders/invoices",
    { orderIds },
    { responseType: "blob" },
  );
  return response;
}

// Utility tải file PDF từ response blob
export function downloadPdfBlob(response, defaultFilename = "hoa-don.pdf") {
  const contentDisposition = response.headers["content-disposition"];
  let filename = defaultFilename;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}