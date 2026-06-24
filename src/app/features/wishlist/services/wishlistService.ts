import { WishlistItem } from '../../../shared/types/types';

export const wishlistService = {
  saveWishlist: (wishlist: WishlistItem[]) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  },
  
  loadWishlist: (): WishlistItem[] => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  },
  
  clearWishlist: () => {
    localStorage.removeItem('wishlist');
  },
};