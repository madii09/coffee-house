import { CoffeeItem } from "../types/product";

const API_BASE = "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";

export async function fetchFavorites(): Promise<CoffeeItem[]> {
  try {
    const res = await fetch(`${API_BASE}/favorites`);
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchMenu(): Promise<CoffeeItem[]> {
  try {
    const res = await fetch(`${API_BASE}/menu`);
    if (!res.ok) throw new Error("Failed to fetch menu");
    return await res.json();
  } catch (error) {
    throw error;
  }
}
