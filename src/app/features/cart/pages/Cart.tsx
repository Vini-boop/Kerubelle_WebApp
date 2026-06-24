import { useCart } from '../../../providers/CartProvider';
import { Link } from 'react-router-dom';
import { Size } from '../../../shared/types/types';
import { useState } from 'react';
import { Trash2, Minus, Plus, Tag, Truck } from 'lucide-react';

export function Cart() {
  const {
    cart, updateQuantity, removeFromCart, getCartTotal,
    getDeliveryFee, getDiscountAmount, getFinalTotal,
    applyDiscount, discountCode, discountPercent,
  } = useCart();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      applyDiscount(promoInput.trim());
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
          <Link to="/shop">
            <button className="bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white px-8 py-3 rounded-full hover:shadow-lg transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const price = item.product.discountPrice || item.product.sellingPrice;
            return (
              <div key={index} className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                <div className="aspect-square w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.product.name}</h3>
                  <p className="text-gray-500 text-sm">{item.color} • {item.size}</p>
                  <p className="font-semibold text-[#D4A5B8] mt-1">KES {price.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.color, item.size as Size, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.color, item.size as Size, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-semibold">KES {(price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.color, item.size as Size)}
                    className="text-red-400 hover:text-red-600 mt-1 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

            {/* Promo Code */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">Discount Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-[#F8C8DC] text-white rounded-lg text-sm font-medium hover:bg-[#D4A5B8] transition-colors"
                >
                  Apply
                </button>
              </div>
              {discountCode && (
                <p className="text-xs text-green-600 mt-1">✓ Code "{discountCode}" applied ({discountPercent}% off)</p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>KES {getCartTotal().toLocaleString()}</span>
              </div>
              {getDiscountAmount() > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-KES {getDiscountAmount().toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Delivery
                </span>
                <span>{getDeliveryFee() === 0 ? <span className="text-green-600">Free</span> : `KES ${getDeliveryFee().toLocaleString()}`}</span>
              </div>
              {getDeliveryFee() > 0 && (
                <p className="text-xs text-gray-400">Free delivery on orders over KES 5,000</p>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#D4A5B8]">KES {getFinalTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/checkout">
                <button className="w-full bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white py-4 rounded-full hover:shadow-lg transition-all font-medium">
                  Proceed to Checkout
                </button>
              </Link>
              <Link to="/shop" className="block">
                <button className="w-full py-3 border border-gray-200 rounded-full text-gray-600 hover:border-[#F8C8DC] transition-all text-sm">
                  Continue Shopping
                </button>
              </Link>
              <p className="text-center text-xs text-gray-500 mt-2">
                New customer? <Link to="/register" className="text-[#F8C8DC] hover:underline">Create an account</Link> for faster checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}