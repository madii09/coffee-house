import { CartItem } from '../types/types';

const CART_KEY = 'coffee_cart_v1';
const API_BASE = import.meta.env.VITE_API_BASE;

function readCartLocal(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCartLocal(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCounter();
}

function isLoggedIn(): boolean {
  return !!localStorage.getItem('access_token');
}

function formatPrice(val: number): string {
  return val.toFixed(2);
}

function escapeHtml(str: string): string {
  return str
    ? str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
    : '';
}

function $$<T extends HTMLElement>(sel: string): T | null {
  return document.querySelector<T>(sel);
}

export function updateCartCounter(): void {
  const counterEl = $$('.cart-count');
  const iconEl = $$('.cart-icon');

  const cart = readCartLocal();
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0);

  if (counterEl) counterEl.textContent = totalItems.toString();
  if (iconEl) iconEl.classList.toggle('hidden', totalItems === 0 && !isLoggedIn());
}

export function showTopNotification(msg: string): void {
  const old = document.querySelector('.top-notification');
  if (old) old.remove();

  const div = document.createElement('div');
  div.className = 'top-notification';
  div.textContent = msg;
  document.body.appendChild(div);

  setTimeout(() => div.classList.add('show'), 50);
  setTimeout(() => div.classList.remove('show'), 4000);
  setTimeout(() => div.remove(), 4500);
}

export function addToCart(item: CartItem): void {
  const cart = readCartLocal();

  const existing = cart.find(
    (c) =>
      c.name === item.name &&
      c.size.label === item.size.label &&
      JSON.stringify(c.extras) === JSON.stringify(item.extras)
  );

  if (existing) {
    if (item.image && !existing.image) existing.image = item.image;
    existing.quantity += item.quantity;
    const pricePerItem = item.basePrice ?? existing.basePrice ?? item.totalPrice / existing.quantity;
    existing.totalPrice = pricePerItem * existing.quantity;

    if (item.discountPrice) existing.discountPrice = item.discountPrice;
  } else {
    if (!item.basePrice) item.basePrice = item.totalPrice / item.quantity;
    if (item.discountPrice) item.discountPrice = item.discountPrice;
    cart.push(item);
  }


  saveCartLocal(cart);
  showTopNotification(`${item.name} added to cart`);
}

function renderCartPage(): void {
  const root = $$('.cart-root');
  if (!root) return;

  const cart = readCartLocal();
  if (!cart.length) {
    root.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty</h3>
        <p>Add items from the menu to get started.</p>
      </div>`;
    updateCartCounter();
    return;
  }

  const rowsHtml = cart
    .map(
      (c, idx) => {
        const priceHtml = isLoggedIn() && c.discountPrice
          ? `<span style="text-decoration: line-through; color: #888; margin-right: 0.5rem;">
       $${formatPrice(c.totalPrice)}
     </span>
     <span style="color: #403F3D; font-weight: 600;">
       $${formatPrice(c.discountPrice)}
     </span>`
          : `$${formatPrice(c.totalPrice)}`;


        return `
    <div class="cart-item" data-idx="${idx}">
    <div class="ci-left">
      <button class="ci-remove" data-idx="${idx}" aria-label="Remove item">🗑</button>
      <img src="${c.image?.startsWith('http') ? c.image : `./assets/images/${c.image || 'placeholder.png'}`}" 
           alt="${escapeHtml(c.name)}" width="80" />
      <div class="ci-name">${escapeHtml(c.name)}</div>
      <div class="ci-size">
        Size: ${escapeHtml(c.size.label)}
        ${c.extras.length ? '| Extras: ' + c.extras.map((x) => escapeHtml(x.name)).join(', ') : ''}
      </div>
    </div>

    <div class="ci-right">
      <div class="ci-price">${priceHtml}</div>
    </div>
  </div>`;
      }
    )
    .join('');

  const total = cart.reduce((s, it) => {
    if (isLoggedIn() && it.discountPrice) return s + it.discountPrice;
    return s + it.totalPrice;
  }, 0);

  const authSection = isLoggedIn()
    ? `
    <div class="checkout-section">
      <div class="delivery-address">
        Delivery address: <strong>${escapeHtml(localStorage.getItem('delivery_address') || 'No address')}</strong>
      </div>
      <button class="confirm-order-btn">Confirm Order</button>
    </div>`
    : `
    <div class="auth-prompt">
      <button class="sign-in-btn">Sign In</button>
      <button class="register-btn">Register</button>
    </div>`;


  root.innerHTML = `
    <div class="cart-list">${rowsHtml}</div>
    <div class="cart-summary">
      <div class="cart-total">Order total: <strong>$${formatPrice(total)}</strong></div>
      ${authSection}
      <div class="order-status"></div>
    </div>
  `;

  root.querySelectorAll('.ci-remove').forEach((btn) =>
    btn.addEventListener('click', (ev) => {
      const idx = Number((ev.currentTarget as HTMLElement).dataset.idx);
      const cur = readCartLocal();
      cur.splice(idx, 1);
      saveCartLocal(cur);
      renderCartPage();
    })
  );

  root.querySelector('.sign-in-btn')?.addEventListener('click', () => (location.href = '/signin.html'));
  root.querySelector('.register-btn')?.addEventListener('click', () => (location.href = '/register.html'));

  root.querySelector('.confirm-order-btn')?.addEventListener('click', async () => {
    const status = root.querySelector('.order-status');
    if (status) status.innerHTML = '<div class="order-loader">Placing order...</div>';

    try {
      const cartToSend = readCartLocal();
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Not logged in');

      const payload = {
        items: cartToSend.map((it) => ({
          productId: Number(it.id),
          size: it.size.label,
          additives: it.extras.map((e) => e.name),
          quantity: it.quantity,
        })),
        totalPrice: cartToSend.reduce((sum, it) => sum + it.totalPrice, 0),
      };

      const res = await fetch(`${API_BASE}/orders/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Order failed');

      saveCartLocal([]);
      if (status)
        status.innerHTML = `
      <div class="order-success">
        ${data.data?.message || 'Order placed successfully!'}<br/>
        <small>Order ID: ${data.data?.orderId || '-'}</small>
      </div>`;
      showTopNotification('Your order is confirmed');
      renderCartPage();
    } catch (err) {
      console.error('Order error', err);
      showTopNotification('Something went wrong. Please, try again');
      if (status) status.innerHTML = `<div class="order-error">Order failed. Please try again.</div>`;
    }
  });

  updateCartCounter();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
  updateCartCounter();
});
