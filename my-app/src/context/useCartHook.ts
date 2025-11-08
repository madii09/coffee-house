// context/useCartHook.ts
import { useState, useEffect } from 'react';
import type { CartItem, CartContextType } from '../types/types';

const CART_KEY = 'coffee_cart_v1';

export const useCartHook = (): CartContextType => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Add item to cart (immutable)
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

  // Remove item by index
  const removeItem = (idx: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart.splice(idx, 1);
      return newCart;
    });
  };

  // Clear the cart
  const clearCart = () => setCart([]);

  // Compute totals
  const totalItems = cart.reduce((sum, it) => sum + it.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, it) => sum + (it.discountPrice ?? it.totalPrice),
    0
  );

  return { cart, addItem, removeItem, clearCart, totalItems, totalPrice };
};
