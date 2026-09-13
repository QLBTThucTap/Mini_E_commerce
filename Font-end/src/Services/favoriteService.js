import http from "./http";

export const getFavorites = async () => {
  const response = await http.get("/favorites");
  return response.data;
};

export const addFavorite = async (productId) => {
  const response = await http.post("/favorites", { productId });
  return response.data;
};

export const removeFavorite = async (productId) => {
  const response = await http.delete(`/favorites/${productId}`);
  return response.data;
};
