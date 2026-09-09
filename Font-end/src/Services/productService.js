import Instance from "./http";

export async function getProducts(pagination) {
  const response = await Instance.get("/products", { params: pagination });
  return response.data;
}

export async function getProductById(id) {
  const response = await Instance.get(`/products/${id}`);
  return response.data;
}

export async function getCategories() {
  const response = await Instance.get("/products/categories");
  return response.data;
}

//Admin có quyền thêm, sửa, xóa sản phẩm
export async function createProduct(data) {
  const response = await Instance.post("/products", data);
  return response.data;
}

export async function updateProduct(id, data) {
  const response = await Instance.patch(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await Instance.delete(`/products/${id}`);
  return response.data;
}
