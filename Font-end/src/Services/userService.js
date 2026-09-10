import Instance from "./http";

export async function getUsers() {
  const response = await Instance.get("/users");
  return response.data;
}

export async function getUserById(id) {
  const response = await Instance.get(`/users/${id}`);
  return response.data;
}

export async function createUser(data) {
  const response = await Instance.post("/users", data);
  return response.data;
}

export async function updateUser(id, data) {
  const response = await Instance.patch(`/users/${id}`, data);
  return response.data;
}

export async function toggleLockUser(id, isLocked) {
  const response = await Instance.patch(`/users/${id}/lock`, { isLocked });
  return response.data;
}

export async function deleteUser(id) {
  const response = await Instance.delete(`/users/${id}`);
  return response.data;
}
