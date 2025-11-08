export type Size = {
  size: string;
  price: string | number;
  discountPrice?: string | number;
};

export type Additive = {
  name: string;
  price: string | number;
  discountPrice?: string | number;
};

export type MenuItem = {
  id: string | number;
  name: string;
  description: string;
  price?: string | number;
  discountPrice?: string | number;
  image?: string;
  category?: string;
  sizes?: Record<string, Size>;
  additives?: Additive[];
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image?: string;
  category?: string;
}
export type CartSize = {
  key: string;
  label: string;
  addPrice: number;
};

export type CartExtra = {
  name: string;
  price: number;
};

export interface CartItem {
  id?: string | number;
  name: string;
  image?: string;
  basePrice: number;
  discountPrice?: number;
  size: CartSize;
  extras: CartExtra[];
  quantity: number;
  totalPrice: number;
}

export interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (idx: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export type FavoriteItem = MenuItem;