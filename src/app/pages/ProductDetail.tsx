import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useStore } from '../providers/StoreProvider';
import { Size } from '../shared/types/types';
import { useCart } from '../providers/CartProvider';
import { useWishlist } from '../providers/WishlistProvider';
import { ShoppingBag, Heart, Check, Star, Sparkles, ArrowLeft } from 'lucide-react';
import { ProductCard } from '../features/products/components/ProductCard';
import { toast } from 'sonner';
import { Product } from '../shared/types/types';
import { PageLoader } from '../components/common/PageLoader';
import { PageError } from '../components/common/PageError';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { products, loading, error } = useStore();

  const product = products.find((p: Product) => p.id === id);
  const relatedProducts = products.filter((p: Product) =>
    p.id !== id && (p.type === product?.type || p.material === product?.material)
  ).slice(0, 4) as Product[];

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState<Size>(product?.sizes[0] || 'Medium');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || '');
      setSelectedSize(product.sizes[0] || 'Medium');
    }
  }, [product]);

  if (loading) return <PageLoader />;

  if (error) return <PageError message={error} onRetry={() => window.location.reload()} />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Link to="/shop" className="text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    toast.success('Added to cart!', {
      description: `${product.name} - ${selectedColor}, ${selectedSize}`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    navigate('/cart');
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const getColorHex = (color: string) => {
    const colorMap: Record<string, string> = {
      'Baby Pink': '#F8C8DC',
      'Rose Gold': '#D4A5B8',
      'White': '#FFFFFF',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Nude': '#E1C4AA',
      'Peach': '#FFE5B4',
      'Burgundy': '#800020',
      'Black': '#000000',
      'Lavender': '#E6E6FA',
      'Mint': '#98FF98',
      'Champagne': '#F7E7CE',
      'Taupe': '#B38B6D',
      'Grey': '#808080',
      'Navy': '#000080',
      'Camel': '#C19A6B',
      'Brown': '#8B4513',
      'Red': '#FF0000',
      'Beige': '#F5F5DC',
      'Cream': '#FFFDD0',
      'Floral': '#FFF0F5'
    };
    return colorMap[color] || '#F8C8DC';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#F8C8DC] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FFF5F9] shadow-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.newArrival && (
                  <span className="bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white text-sm px-4 py-2 rounded-full">
                    New Arrival
                  </span>
                )}
                {product.limitedEdition && (
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    Limited Edition
                  </span>
                )}
                {product.bestSeller && (
                  <span className="bg-white text-[#F8C8DC] text-sm px-4 py-2 rounded-full font-medium shadow-md">
                    Best Seller
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-[#F8C8DC]">
                ${product.sellingPrice}
              </span>
              {product.discountPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.discountPrice}
                </span>
              )}
              <div className="flex gap-2">
                <span className="bg-[#FFF5F9] text-sm px-3 py-1 rounded-full text-gray-700">
                  {product.type}
                </span>
                <span className="bg-[#FFF5F9] text-sm px-3 py-1 rounded-full text-gray-700">
                  {product.material}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-800 mb-3">
                Color: <span className="text-[#F8C8DC]">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color
                      ? 'border-[#F8C8DC] scale-110'
                      : 'border-gray-200 hover:border-[#F8C8DC]'
                      }`}
                    style={{ backgroundColor: getColorHex(color) }}
                  >
                    {selectedColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-800 mb-3">
                Size: <span className="text-[#F8C8DC]">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: Size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg border-2 transition-all ${selectedSize === size
                      ? 'border-[#F8C8DC] bg-[#FFF5F9] text-[#F8C8DC]'
                      : 'border-gray-200 hover:border-[#F8C8DC]'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block font-semibold text-gray-800 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-[#F8C8DC]">
                    ${((product.discountPrice || product.sellingPrice) * quantity).toFixed(2)}
                  </span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`px-6 py-4 rounded-full border-2 transition-all ${inWishlist
                  ? 'border-[#F8C8DC] bg-[#FFF5F9] text-[#F8C8DC]'
                  : 'border-gray-200 hover:border-[#F8C8DC]'
                  }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#F8C8DC]' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </button>

            {/* Features */}
            <div className="mt-8 space-y-4 bg-[#FFF5F9] rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#F8C8DC]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Free Personalization</p>
                  <p className="text-sm text-gray-600">Add custom name engraving</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#F8C8DC]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Premium Packaging</p>
                  <p className="text-sm text-gray-600">Gift-ready pink & gold box</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}