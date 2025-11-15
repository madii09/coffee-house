import { useOrdersStore } from '../zustand/useOrdersStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/_orders.scss';

const Orders: React.FC = () => {
  const orders = useOrdersStore((state) => state.orders);
  const deleteOrder = useOrdersStore((state) => state.deleteOrder);

  return (
    <>
      <Header />
      <main className='container orders'>
        <h1 className='page-title'>Order History</h1>
        {orders.length === 0 ? (
          <p>You have no previous orders.</p>
        ) : (
          <div className='orders-list'>
            {orders.map((order) => (
              <div className='order-card' key={order.orderId}>
                <div className='order-header'>
                  <div>
                    <strong>Order ID:</strong> {order.orderId}{' '}
                    <strong>Date:</strong>{' '}
                    {new Date(order.createdAt).toLocaleString()}
                  </div>

                  <button
                    className='ci-remove'
                    onClick={() => deleteOrder(order.orderId)}
                    aria-label='Remove item'
                  >
                    🗑
                  </button>
                </div>
                <div className='order-items'>
                  {order.items.map((item, idx) => (
                    <div className='order-item' key={idx}>
                      <span>{item.name}</span> - <span>Size: {item.size}</span>{' '}
                      {item.additives?.length && (
                        <span>| Extras: {item.additives.join(', ')}</span>
                      )}
                      <span> | Qty: {item.quantity}</span> |{' '}
                      <span>Price: ${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className='order-total'>
                  <p>Total: ${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Orders;
