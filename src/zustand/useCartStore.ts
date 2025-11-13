import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

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
  totalItems: number;
  totalPrice: number;
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

          set({
            cart: [
              ...get().cart.slice(0, existingIndex),
              updatedItem,
              ...get().cart.slice(existingIndex + 1),
            ],
          });
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

      get totalItems() {
        return get().cart.reduce((sum, it) => sum + it.quantity, 0);
      },

      get totalPrice() {
        return get().cart.reduce(
          (sum, it) => sum + (it.discountPrice ?? it.totalPrice),
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<CartState> | undefined;

        const { currentUser } = useAuthStore.getState();
        if (currentUser) {
          const userKey = `cart_user_${currentUser.id}`;
          const saved = localStorage.getItem(userKey);
          if (saved) {
            return { ...current, cart: JSON.parse(saved) };
          }
        }

        return { ...current, ...(persistedState ?? {}) };
      },
    }
  )
);
