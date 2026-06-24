import { Link } from 'react-router-dom';
import { useWishlist } from '../providers/WishlistProvider';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

export function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item: any) => (
              <div
                key={item.product.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#F8C8DC]/10"
              >
                <Link to={`/product/${item.product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#FFF5F9]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 group-hover:text-[#F8C8DC] transition-colors mb-2">
                      {item.product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-[#F8C8DC] font-semibold">
                        ${item.product.price}
                      </span>

                      <div className="flex gap-2">
                        <span className="text-xs bg-[#FFF5F9] px-2 py-1 rounded-full text-gray-600">
                          {item.product.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(item.product.id);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-full flex items-center justify-center transition-colors z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Quick Add to Bag */}
                <Link
                  to={`/product/${item.product.id}`}
                  className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#FFF5F9] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-[#F8C8DC]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Save your favorite items to keep track of them
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Discover Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
