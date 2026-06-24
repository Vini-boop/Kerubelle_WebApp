import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../providers/CartProvider';
import { useWishlist } from '../../../providers/WishlistProvider';
import { useStore } from '../../../providers/StoreProvider';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Size } from '../../../shared/types/types';
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Package } from 'lucide-react';

const colorMap: Record<string, string> = {
  'Baby Pink': '#F8C8DC', 'Rose Gold': '#D4A5B8', 'White': '#FFFFFF',
  'Silver': '#C0C0C0', 'Gold': '#FFD700', 'Nude': '#E1C4AA',
  'Peach': '#FFE5B4', 'Burgundy': '#800020', 'Black': '#000000',
  'Lavender': '#E6E6FA', 'Mint': '#98FF98', 'Champagne': '#F7E7CE',
  'Taupe': '#B38B6D', 'Grey': '#808080', 'Navy': '#000080',
  'Camel': '#C19A6B', 'Brown': '#8B4513', 'Red': '#FF0000',
  'Beige': '#F5F5DC', 'Cream': '#FFFDD0', 'Floral': '#FFF0F5',
};

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const store = useStore();

  const product = store.getProductById(id || '');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Set defaults
  if (product && !selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }
  if (product && !selectedSize && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0]);
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
        <Button onClick={() => navigate('/shop')} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.discountPrice || product.sellingPrice || product.costPrice || 0;
  const hasDiscount = product.discountPrice && product.discountPrice < (product.sellingPrice || 0);
  const subtotal = (displayPrice || 0) * quantity;
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (product && selectedColor && selectedSize) {
      addToCart(product, selectedColor, selectedSize as Size, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product && selectedColor && selectedSize) {
      addToCart(product, selectedColor, selectedSize as Size, quantity);
      navigate('/cart');
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {outOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-2 rounded-full text-lg font-semibold">Out of Stock</span>
              </div>
            )}
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {Math.round((1 - product.discountPrice! / product.sellingPrice) * 100)}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
              <div className="mt-2 flex items-baseline gap-3">
                <p className="text-2xl font-semibold text-[#F8C8DC]">
                  KES {(displayPrice || 0).toLocaleString()}
                </p>
                {hasDiscount && (
                  <p className="text-lg text-gray-400 line-through">
                    KES {(product.sellingPrice || 0).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full transition-all ${inWishlist ? 'bg-[#F8C8DC] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#F8C8DC]/20'}`}
            >
              <Heart className={`w-6 h-6 ${inWishlist ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Stock Status */}
          <div className="mt-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            {outOfStock ? (
              <span className="text-red-500 font-medium">Out of Stock</span>
            ) : lowStock ? (
              <span className="text-amber-500 font-medium">Only {product.stock} left in stock!</span>
            ) : (
              <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
            )}
          </div>

          <p className="text-gray-600 mt-4">{product.description}</p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Colors</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {product.colors.map((color: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                    }`}
                  style={{ backgroundColor: colorMap[color] || '#F8C8DC' }}
                  title={color}
                />
              ))}
            </div>
            {selectedColor && <p className="text-sm text-gray-500 mt-1">{selectedColor}</p>}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Size</h3>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full max-w-xs mt-2">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size: string, idx: number) => (
                  <SelectItem key={idx} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Quantity</h3>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="text-sm text-gray-500">Max: {product.stock}</span>
            </div>
          </div>

          {/* Subtotal Preview */}
          <div className="mt-6 bg-[#FFF5F9] p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-xl font-bold text-[#D4A5B8]">KES {subtotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] hover:from-[#F8C8DC]/90 hover:to-[#D4A5B8]/90 text-white py-6 disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[200px] border-[#F8C8DC] text-[#F8C8DC] hover:bg-[#F8C8DC]/10 py-6"
              onClick={handleBuyNow}
              disabled={outOfStock}
            >
              Buy Now
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-5 h-5 text-[#D4A5B8] mb-1" />
              <span className="text-xs text-gray-500">Free Delivery over KES 5,000</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-5 h-5 text-[#D4A5B8] mb-1" />
              <span className="text-xs text-gray-500">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-5 h-5 text-[#D4A5B8] mb-1" />
              <span className="text-xs text-gray-500">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="mt-16 max-w-3xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
            <ul className="space-y-2">
              <li><span className="font-medium">Type:</span> {product.type}</li>
              <li><span className="font-medium">Material:</span> {product.material}</li>
              <li><span className="font-medium">Available Colors:</span> {product.colors.join(', ')}</li>
              <li><span className="font-medium">Available Sizes:</span> {product.sizes.join(', ')}</li>
              <li><span className="font-medium">Stock:</span> {product.stock} units</li>
              <li><span className="font-medium">Sales:</span> {product.salesCount} sold</li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="p-6 bg-gray-50 rounded-xl">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        </TabsContent>
        <TabsContent value="shipping">
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
            <ul className="space-y-2">
              <li>Free delivery on orders over KES 5,000</li>
              <li>Standard delivery: 3-5 business days (KES 250)</li>
              <li>Same-day delivery available in Nairobi</li>
              <li>Hassle-free returns within 30 days</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}