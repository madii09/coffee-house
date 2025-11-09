import type { CoffeeItem } from "../types/products";
import type { Additive, MenuItem, Size } from "../types/types";
import images from "../data/images.json";

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

export const fetchMenuItemById = async (id: number): Promise<MenuItem> => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch menu item");

  const { data } = await res.json();

  const sizes: Record<string, Size> | undefined = data.sizes
    ? Object.fromEntries(
      Object.entries(data.sizes).map(([key, val]) => {
        const sizeVal = val as { size: string; price: string; discountPrice?: string };
        return [
          key,
          {
            size: sizeVal.size,
            price: Number(sizeVal.price),
            discountPrice: sizeVal.discountPrice
              ? Number(sizeVal.discountPrice)
              : undefined,
          },
        ];
      })
    )
    : undefined;

  const additives: Additive[] | undefined = data.additives
    ? data.additives.map((a: { name: string; price: string; discountPrice?: string }) => ({
      name: a.name,
      price: Number(a.price),
      discountPrice: a.discountPrice ? Number(a.discountPrice) : undefined,
    }))
    : undefined;

  return {
    ...data,
    price: Number(data.price),
    discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
    sizes,
    additives,
  };
};