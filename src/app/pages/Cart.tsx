import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../providers/CartProvider';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const DELIVERY_COST = 15;

export function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const total = subtotal + (cart.length > 0 ? DELIVERY_COST : 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#FFF5F9] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-[#F8C8DC]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Discover our beautiful collection and add your favorites to cart
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.color}-${item.size}-${index}`}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#F8C8DC]/10"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-[#FFF5F9]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="block"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1 hover:text-[#F8C8DC] transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                      <span>Color: {item.color}</span>
                      <span>•</span>
                      <span>Size: {item.size}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.color,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.color,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="hidden sm:block">
                          <p className="font-semibold text-[#F8C8DC]">
                            ${((item.product.discountPrice || item.product.sellingPrice) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${item.product.discountPrice || item.product.sellingPrice} each
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.color, item.size)
                        }
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile Price */}
                    <div className="sm:hidden mt-3">
                      <p className="font-semibold text-[#F8C8DC]">
                        ${((item.product.discountPrice || item.product.sellingPrice) * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${item.product.discountPrice || item.product.sellingPrice} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-[#F8C8DC]/10">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-semibold">${DELIVERY_COST.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-[#F8C8DC]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/shop"
                className="block text-center text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F8C8DC] rounded-full"></div>
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F8C8DC] rounded-full"></div>
                  <span>Premium gift packaging included</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F8C8DC] rounded-full"></div>
                  <span>Earn loyalty points on this order</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
