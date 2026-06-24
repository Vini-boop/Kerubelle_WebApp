import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem, Product } from '../shared/types/types';
import { wishlistService } from '../features/wishlist/services/wishlistService';

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWishlist = wishlistService.loadWishlist();
    setWishlist(savedWishlist);
  }, []);

  // Save to localStorage when wishlist changes
  useEffect(() => {
    wishlistService.saveWishlist(wishlist);
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
      if (prevWishlist.some(item => item.product.id === product.id)) {
        return prevWishlist;
      }
      return [...prevWishlist, { product }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prevWishlist =>
      prevWishlist.filter(item => item.product.id !== productId)
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}