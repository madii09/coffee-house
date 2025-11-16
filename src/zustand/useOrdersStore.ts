import { create } from 'zustand';

interface OrderItem {
  productId: number;
  name: string;
  size: string;
  additives?: string[];
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

interface OrdersState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'orderId'>) => Order;
  deleteOrder: (orderId: number) => void;
  clearOrders: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: JSON.parse(localStorage.getItem('orders') || '[]'),

  addOrder: (order) => {
    const orders = get().orders;
    const nextId = orders.length ? orders[orders.length - 1].orderId + 1 : 1;

    const newOrder: Order = { ...order, orderId: nextId };
    const updatedOrders = [...orders, newOrder];

    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    set({ orders: updatedOrders });

    return newOrder;
  },

  deleteOrder: (orderId) => {
    const updatedOrders = get().orders.filter((o) => o.orderId !== orderId);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    set({ orders: updatedOrders });
  },

  clearOrders: () => {
    localStorage.removeItem('orders');
    set({ orders: [] });
  },
}));
