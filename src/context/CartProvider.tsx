import type { ReactNode } from 'react';
import { CartContext } from './CartContext';
import { useCartHook } from './useCartHook';

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { cart, addItem, removeItem, clearCart, totalItems, totalPrice } =
    useCartHook();

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
