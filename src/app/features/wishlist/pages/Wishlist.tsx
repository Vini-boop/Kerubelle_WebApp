import { useWishlist } from '../../../providers/WishlistProvider';
import { ProductCard } from '../../products/components/ProductCard';

export function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {wishlist.map((item, index) => (
            <div key={index} className="relative">
              <ProductCard product={item.product} />
              <button
                onClick={() => handleRemove(item.product.id)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8">Save items you love for later by clicking the heart icon on product pages</p>
          <a href="/shop">
            <button className="bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white px-8 py-3 rounded-full hover:shadow-lg transition-all">
              Start Shopping
            </button>
          </a>
        </div>
      )}
    </div>
  );
}