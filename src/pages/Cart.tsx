import { useState } from 'react';
import { useCart } from '../context/useCart';
import { showTopNotification } from '../utils/cartHelpers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import images from '../data/images.json';

const API_BASE = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

const Cart: React.FC = () => {
  const { cart, removeItem, clearCart, totalPrice } = useCart();
  const [orderStatus, setOrderStatus] = useState<string>('');
  const { currentUser } = useAuth();

  const confirmOrder = async () => {
    setOrderStatus('Placing order...');
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Not logged in');

      const payload = {
        items: cart.map((it) => ({
          productId: Number(it.id),
          size: it.size.label,
          additives: it.extras.map((e) => e.name),
          quantity: it.quantity,
        })),
        totalPrice: cart.reduce((sum, it) => sum + it.totalPrice, 0),
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

      clearCart();
      showTopNotification(
        'Thank you for your order! Our manager will contact you shortly'
      );
      setOrderStatus(
        `Order placed successfully! Order ID: ${data.data?.orderId || '-'}`
      );
    } catch (err) {
      console.error('Order error', err);
      showTopNotification('Something went wrong. Please, try again');
      setOrderStatus('Order failed. Please try again.');
    }
  };

  const getImagePath = (name: string, fallback?: string) => {
    const matched = images.find(
      (img: { name: string; image: string }) =>
        img.name.toLowerCase() === name.toLowerCase()
    );

    return matched
      ? `/assets/images/${matched.image}`
      : fallback
      ? `/assets/images/${fallback}`
      : '/assets/images/placeholder.png';
  };

  return (
    <>
      <Header />
      <main className='container cart'>
        <h1 className='page-title'>Cart</h1>

        {cart.length === 0 ? (
          <div className='cart-empty'>
            <h3>Your cart is empty</h3>
            <p>Add items from the menu to get started.</p>
          </div>
        ) : (
          <div className='cart-content'>
            <div className='cart-list'>
              {cart.map((c, idx) => (
                <div className='cart-item' key={idx}>
                  <div className='ci-left'>
                    <button
                      className='ci-remove'
                      onClick={() => removeItem(idx)}
                      aria-label='Remove item'
                    >
                      🗑
                    </button>

                    <img
                      src={getImagePath(c.name, c.image)}
                      alt={c.name}
                      width={80}
                    />

                    <div className='ci-name'>{c.name}</div>
                    <div className='ci-size'>
                      Size: {c.size.label}
                      {c.extras.length
                        ? ` | Extras: ${c.extras.map((x) => x.name).join(', ')}`
                        : ''}
                    </div>
                  </div>

                  <div className='ci-right'>
                    <div className='ci-price'>
                      {c.discountPrice !== undefined ? (
                        <>
                          <span
                            style={{
                              textDecoration: 'line-through',
                              color: '#888',
                              marginRight: '0.5rem',
                            }}
                          >
                            ${c.basePrice.toFixed(2)}
                          </span>
                          <span style={{ color: '#403F3D', fontWeight: 600 }}>
                            ${c.discountPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        `$${c.basePrice.toFixed(2)}`
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='cart-summary'>
              <div className='cart-total'>
                Order total:{' '}
                {cart.some((it) => it.discountPrice !== undefined) ? (
                  <>
                    <span
                      style={{
                        textDecoration: 'line-through',
                        color: '#888',
                        marginRight: '0.5rem',
                      }}
                    >
                      $
                      {cart
                        .reduce((sum, it) => sum + it.basePrice, 0)
                        .toFixed(2)}
                    </span>
                    <span style={{ color: '#403F3D', fontWeight: 600 }}>
                      $
                      {cart
                        .reduce(
                          (sum, it) => sum + (it.discountPrice ?? it.basePrice),
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </>
                ) : (
                  <strong>${totalPrice.toFixed(2)}</strong>
                )}
              </div>

              {currentUser ? (
                <div className='checkout-section'>
                  <div className='delivery-address'>
                    Delivery address:{' '}
                    <strong>
                      {localStorage.getItem('delivery_address') || 'No address'}
                    </strong>
                  </div>
                  <button className='confirm-order-btn' onClick={confirmOrder}>
                    Confirm Order
                  </button>
                </div>
              ) : (
                <div className='auth-prompt'>
                  <button onClick={() => (window.location.href = '/signin')}>
                    Sign In
                  </button>
                  <button onClick={() => (window.location.href = '/register')}>
                    Register
                  </button>
                </div>
              )}

              {orderStatus && <div className='order-status'>{orderStatus}</div>}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Cart;
