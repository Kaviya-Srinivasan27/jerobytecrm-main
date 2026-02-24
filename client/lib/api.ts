// client/src/lib/api.ts

// This connects your frontend to the live Render backend you just deployed
export const API_BASE_URL = "https://server-main-h3qo.onrender.com/api";

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};
