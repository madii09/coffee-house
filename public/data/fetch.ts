import { CoffeeItem } from '../../src/types/product';

const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/api';

export async function fetchFavorites(): Promise<CoffeeItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/favorites`);
    if (!res.ok) throw new Error('Failed to fetch favorites');
    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchMenu(): Promise<CoffeeItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/menu`);
    if (!res.ok) throw new Error('Failed to fetch menu');
    return await res.json();
  } catch (error) {
    throw error;
  }
}
