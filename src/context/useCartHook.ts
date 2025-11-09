import { useState, useEffect } from 'react';
import type { CartItem, CartContextType } from '../types/types';
import { useAuth } from '../context/AuthContext';

export const useCartHook = (): CartContextType => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  const getCartKey = () => (currentUser ? `cart_user_${currentUser.id}` : 'cart_guest');

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(getCartKey());
      setCart(saved ? JSON.parse(saved) : []);
    } else {
      setCart([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (cart.length > 0) {
        localStorage.setItem(getCartKey(), JSON.stringify(cart));
      } else {
        localStorage.removeItem(getCartKey());
      }
    }
  }, [cart, currentUser]);

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
