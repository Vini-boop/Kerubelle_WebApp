import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Size } from '../shared/types/types';
import { useStore } from './StoreProvider';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color: string, size: Size, quantity: number) => void;
  removeFromCart: (productId: string, color: string, size: Size) => void;
  updateQuantity: (productId: string, color: string, size: Size, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getDeliveryFee: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
  applyDiscount: (code: string) => boolean;
  discountCode: string;
  discountPercent: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'kb_cart';
const DISCOUNT_KEY = 'kb_discount';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, color: string, size: Size, quantity: number) => {
    // Validate stock from centralized store
    const storeProduct = store.getProductById(product.id);
    if (!storeProduct) {
      toast.error('Product not found');
      return;
    }

    const existingItem = cart.find(
      item => item.product.id === product.id && item.color === color && item.size === size
    );
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty + quantity > storeProduct.stock) {
      toast.error(`Only ${storeProduct.stock - currentQty} more available in stock`);
      return;
    }

    setCart(prevCart => {
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, color, size, quantity }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string, color: string, size: Size) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.product.id === productId && item.color === color && item.size === size)
      )
    );
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId: string, color: string, size: Size, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    // Validate stock
    const storeProduct = store.getProductById(productId);
    if (storeProduct && quantity > storeProduct.stock) {
      toast.error(`Only ${storeProduct.stock} available in stock`);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode('');
    setDiscountPercent(0);
    localStorage.removeItem(CART_KEY);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.sellingPrice;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getDiscountAmount = () => {
    return discountPercent > 0 ? getCartTotal() * (discountPercent / 100) : 0;
  };

  const getDeliveryFee = () => {
    const afterDiscount = getCartTotal() - getDiscountAmount();
    return afterDiscount >= 5000 ? 0 : 250;
  };

  const getFinalTotal = () => {
    return getCartTotal() - getDiscountAmount() + getDeliveryFee();
  };

  const applyDiscount = (code: string): boolean => {
    const result = store.validatePromoCode(code);
    if (result.valid) {
      setDiscountCode(code.toUpperCase());
      setDiscountPercent(result.discount);
      toast.success(`Discount code applied: ${result.discount}% off!`);
      return true;
    }
    toast.error('Invalid or expired discount code');
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getDeliveryFee,
        getDiscountAmount,
        getFinalTotal,
        applyDiscount,
        discountCode,
        discountPercent,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}