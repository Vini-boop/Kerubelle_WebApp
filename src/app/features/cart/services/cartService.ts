import { CartItem } from '../../../shared/types/types';

export const cartService = {
  saveCart: (cart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  },
  
  loadCart: (): CartItem[] => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  },
  
  clearCart: () => {
    localStorage.removeItem('cart');
  },
};