import type { CoffeeItem } from "../types/products";
import type { MenuItem } from "../types/types";
import images from "../data/images.json"; // ✅ import JSON directly

const API_BASE = "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";

export type FavoritesResponse = {
  data: CoffeeItem[];
};

export async function fetchFavorites(): Promise<FavoritesResponse> {
  try {
    const res = await fetch(`${API_BASE}/products/favorites`);
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return res.json();
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${API_BASE}/products`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

    const json = await res.json();
    const data: MenuItem[] = Array.isArray(json.data) ? json.data : [];

    // Attach images from imported JSON
    return data.map((item) => {
      const matched = images.find(
        (img: { name: string; image: string }) =>
          img.name.toLowerCase() === item.name.toLowerCase()
      );

      return {
        ...item,
        image: matched
          ? `/assets/images/${matched.image}`
          : "/assets/images/placeholder.png",
      };
    });
  } catch (err) {
    console.error("Error fetching menu items:", err);
    return [];
  }
}
