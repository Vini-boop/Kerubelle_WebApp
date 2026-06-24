import { Link } from 'react-router-dom';
import { Product } from '../../../shared/types/types';
import { Heart, Star } from 'lucide-react';
import { useWishlist } from '../../../providers/WishlistProvider';

interface ProductCardProps {
  product: Product;
}

const colorMap: Record<string, string> = {
  'Baby Pink': '#F8C8DC', 'Rose Gold': '#D4A5B8', 'White': '#FFFFFF',
  'Silver': '#C0C0C0', 'Gold': '#FFD700', 'Nude': '#E1C4AA',
  'Peach': '#FFE5B4', 'Burgundy': '#800020', 'Black': '#000000',
  'Lavender': '#E6E6FA', 'Mint': '#98FF98', 'Champagne': '#F7E7CE',
  'Taupe': '#B38B6D', 'Grey': '#808080', 'Navy': '#000080',
  'Camel': '#C19A6B', 'Brown': '#8B4513', 'Red': '#FF0000',
  'Beige': '#F5F5DC', 'Cream': '#FFFDD0', 'Floral': '#FFF0F5',
};

function getStockBadge(stock: number) {
  if (stock === 0) return { text: 'Out of Stock', className: 'bg-red-500 text-white' };
  if (stock <= 5) return { text: `Only ${stock} left`, className: 'bg-amber-500 text-white' };
  return null;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.discountPrice || product.sellingPrice || product.costPrice || 0;
  const hasDiscount = product.discountPrice && product.discountPrice < (product.sellingPrice || 0);
  const stockBadge = getStockBadge(product.stock);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#F8C8DC]/10">

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#FFF5F9]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges — smaller on mobile */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
            {product.newArrival && (
              <span className="bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                New
              </span>
            )}
            {product.limitedEdition && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
                Limited
              </span>
            )}
            {product.bestSeller && (
              <span className="bg-white text-[#F8C8DC] text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                Best Seller
              </span>
            )}
            {hasDiscount && (
              <span className="bg-green-500 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                {Math.round((1 - product.discountPrice! / product.sellingPrice) * 100)}% OFF
              </span>
            )}
            {stockBadge && (
              <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${stockBadge.className}`}>
                {stockBadge.text}
              </span>
            )}
          </div>

          {/* Wishlist Button — smaller on mobile */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${inWishlist
                ? 'bg-[#F8C8DC] text-white'
                : 'bg-white/90 text-gray-600 hover:bg-[#F8C8DC] hover:text-white'
              }`}
          >
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Content — tighter padding on mobile */}
        <div className="p-2.5 sm:p-4">
          <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1">
            <h3 className="font-medium text-gray-800 text-xs sm:text-sm group-hover:text-[#F8C8DC] transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="text-right whitespace-nowrap flex-shrink-0">
              <span className="text-[#F8C8DC] font-semibold text-xs sm:text-sm">
                KES {displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="block text-[10px] sm:text-xs text-gray-400 line-through">
                  KES {(product.sellingPrice || 0).toLocaleString()}
                </span>
              )}
              {hasDiscount && (
                <span className="block text-[10px] sm:text-xs font-bold text-green-600">
                  Save KES {((product.sellingPrice || 0) - displayPrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Type/material tags — hidden on very small screens */}
          <div className="hidden sm:flex flex-wrap gap-1.5 sm:gap-2 text-xs text-gray-500 mb-2">
            <span className="bg-[#FFF5F9] px-2 py-0.5 sm:py-1 rounded-full">{product.type}</span>
            <span className="bg-[#FFF5F9] px-2 py-0.5 sm:py-1 rounded-full">{product.material}</span>
          </div>

          {/* Color swatches — smaller dots on mobile */}
          <div className="flex gap-1 sm:gap-1.5 mt-1 sm:mt-0">
            {product.colors.slice(0, 4).map((color, idx) => (
              <div
                key={idx}
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: colorMap[color] || '#F8C8DC' }}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] sm:text-[10px] text-gray-600">
                +{product.colors.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
