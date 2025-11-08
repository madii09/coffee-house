import { useContext } from 'react';
import { CartContext } from './CartContext';
import type { CartContextType } from '../types/types';

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
