import { CartItem } from '@/types/types';

export const CART_KEY = 'coffee_cart_v1';
const CART_COUNT_SELECTOR = '.cart-count';

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCountUI();
}

export function updateCartCountUI(): void {
  const cart = readCart();
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0);

  document.querySelectorAll<HTMLSpanElement>(CART_COUNT_SELECTOR).forEach(node => {
    node.textContent = String(totalItems);
    node.style.display = 'inline-block';
  });
}



export function addToCart(item: CartItem): void {
  const cart = readCart();
  const existing = cart.find((c) => c.id === item.id && c.size.key === item.size.key);
  if (existing) {
    existing.quantity += item.quantity;
    existing.totalPrice += item.totalPrice;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}
