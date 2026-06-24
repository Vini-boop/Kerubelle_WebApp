import { Order } from '../../../shared/types/types';

export const orderService = {
  saveOrders: (orders: Order[]) => {
    localStorage.setItem('orders', JSON.stringify(orders));
  },
  
  loadOrders: (): Order[] => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  },
  
  addOrder: (order: Order): Order[] => {
    const orders = orderService.loadOrders();
    const updatedOrders = [order, ...orders];
    orderService.saveOrders(updatedOrders);
    return updatedOrders;
  },
  
  clearOrders: () => {
    localStorage.removeItem('orders');
  },
};