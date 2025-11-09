
import { useState, useEffect } from 'react';
import type { CartItem, CartContextType } from '../types/types';

const CART_KEY = 'coffee_cart_v1';

export const useCartHook = (): CartContextType => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_KEY);
    }
  }, [cart]);


  const addItem = (item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (c) =>
          c.id === item.id &&
          c.size.key === item.size.key &&
          JSON.stringify(c.extras) === JSON.stringify(item.extras)
      );

      if (existingIndex !== -1) {
        const updatedItem: CartItem = {
          ...prev[existingIndex],
          quantity: prev[existingIndex].quantity + item.quantity,
          totalPrice: prev[existingIndex].totalPrice + item.totalPrice,
          discountPrice: item.discountPrice ?? prev[existingIndex].discountPrice,
        };

        return [
          ...prev.slice(0, existingIndex),
          updatedItem,
          ...prev.slice(existingIndex + 1),
        ];
      } else {
        return [...prev, item];
      }
    });
  };

  const removeItem = (idx: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart.splice(idx, 1);
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, it) => sum + it.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, it) => sum + (it.discountPrice ?? it.totalPrice),
    0
  );

  return { cart, addItem, removeItem, clearCart, totalItems, totalPrice };
};
