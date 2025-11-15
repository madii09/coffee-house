import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Extra {
  name: string;
  price: number;
  discountPrice?: number;
}

export interface Size {
  key: string;
  label: string;
  price: number;
  discountPrice?: number;
}

export interface CartItem {
  id: number;
  name: string;
  size: Size;
  extras?: Extra[];
  quantity: number;
  totalPrice: number;
  discountPrice?: number;
  image?: string;
  basePrice?: number;
}

interface CartState {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (idx: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (item) => {
        const existingIndex = get().cart.findIndex(
          (c) =>
            c.id === item.id &&
            c.size.key === item.size.key &&
            JSON.stringify(c.extras) === JSON.stringify(item.extras)
        );

        if (existingIndex !== -1) {
          const existing = get().cart[existingIndex];
          const updatedItem: CartItem = {
            ...existing,
            quantity: existing.quantity + item.quantity,
            totalPrice: existing.totalPrice + item.totalPrice,
            discountPrice: item.discountPrice ?? existing.discountPrice,
          };
          const newCart = [
            ...get().cart.slice(0, existingIndex),
            updatedItem,
            ...get().cart.slice(existingIndex + 1),
          ];
          set({ cart: newCart });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },

      removeItem: (idx) => {
        const newCart = [...get().cart];
        newCart.splice(idx, 1);
        set({ cart: newCart });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? Promise.resolve(JSON.parse(item)) : Promise.resolve(null);
        },
        setItem: (name, value) =>
          Promise.resolve(localStorage.setItem(name, JSON.stringify(value))),
        removeItem: (name) => Promise.resolve(localStorage.removeItem(name)),
      },
    }
  )
);
