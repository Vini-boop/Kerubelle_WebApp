import { useState } from 'react';
import { useCart } from '../../../providers/CartProvider';
import { useStore } from '../../../providers/StoreProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { useNavigate } from 'react-router';
import { mockAddresses } from '../../../lib/services/data';
import { PaymentMethod } from '../../../shared/types/types';
import { toast } from 'sonner';
import { CreditCard, Smartphone, MapPin, Shield, CheckCircle } from 'lucide-react';

export function Checkout() {
  const { cart, getCartTotal, getDeliveryFee, getDiscountAmount, getFinalTotal, clearCart, discountCode } = useCart();
  const store = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('M-Pesa');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    setProcessing(true);

    try {
      // Build order items from cart
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      }));

      // Create the order in the centralized store
      const order = await store.createOrder({
        items: orderItems,
        address: selectedAddress || address,
        customerName: user?.name || 'Guest Customer',
        customerEmail: user?.email || 'guest@kerublush.co.ke',
        customerPhone: phone || undefined,
        paymentMethod,
        discountCode: discountCode || undefined,
      });

      // Simulate payment processing (1.5s delay)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Process payment — this updates order status, reduces stock, records payment
      const result = await store.processPayment(order.id);

      if (result.success) {
        toast.success('Payment successful! Your order has been placed.', { duration: 5000 });
        clearCart();
        navigate(`/order/${order.id}`);
      } else {
        store.markPaymentFailed(order.id);
        toast.error('Payment failed. Please try again.');
        setProcessing(false);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">No items in cart</h1>
        <button onClick={() => navigate('/shop')} className="mt-4 px-6 py-2 bg-[#F8C8DC] text-white rounded-full">
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-0 mb-6">
            {[
              { num: 1, label: 'Address' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' },
            ].map(({ num, label }) => (
              <div key={num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= num ? 'bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white shadow-sm' : 'bg-gray-200 text-gray-500'
                    }`}>
                    {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{label}</span>
                </div>
                {num < 3 && (
                  <div className={`h-0.5 w-12 sm:w-20 mx-2 ${step > num ? 'bg-[#F8C8DC]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D4A5B8]" /> Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">Select Existing Address</label>
                  <select
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC]/40 focus:outline-none"
                  >
                    <option value="">Choose an address</option>
                    {mockAddresses.map((addr, idx) => (
                      <option key={idx} value={addr}>{addr}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-sm text-gray-400">Or enter new</span></div>
                </div>

                <div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full shipping address"
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC]/40 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!address && !selectedAddress}
                className={`mt-6 w-full py-3 rounded-lg font-medium transition-all ${!address && !selectedAddress
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white hover:shadow-md'
                  }`}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D4A5B8]" /> Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('M-Pesa')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'M-Pesa' ? 'border-[#4CAF50] bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <Smartphone className="w-6 h-6 text-[#4CAF50]" />
                  <span className="font-medium text-sm">M-Pesa</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'Card' ? 'border-[#2196F3] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <CreditCard className="w-6 h-6 text-[#2196F3]" />
                  <span className="font-medium text-sm">Credit Card</span>
                </button>
              </div>

              {paymentMethod === 'M-Pesa' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC]/40 focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400">You will receive an STK push to confirm payment</p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">Card Number</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC]/40 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm">Expiry Date</label>
                      <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC]/40 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm">CVV</label>
                      <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC]/40 focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={paymentMethod === 'M-Pesa' ? !phone : (!cardNumber || !expiryDate || !cvv)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${(paymentMethod === 'M-Pesa' ? !phone : (!cardNumber || !expiryDate || !cvv))
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white hover:shadow-md'
                    }`}
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Review Order</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Shipping Address</h3>
                  <p className="text-gray-600 text-sm">{selectedAddress || address}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Payment</h3>
                  <p className="text-gray-600 text-sm">
                    {paymentMethod === 'M-Pesa' ? `M-Pesa: ${phone}` : `Card ending in ${cardNumber.slice(-4)}`}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Items ({cart.length})</h3>
                  <div className="space-y-3">
                    {cart.map((item, index) => {
                      const price = item.product.discountPrice || item.product.sellingPrice;
                      return (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <img src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-gray-400 text-xs">{item.color} • {item.size} × {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-medium">KES {(price * item.quantity).toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>KES {getCartTotal().toLocaleString()}</span>
                  </div>
                  {getDiscountAmount() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-KES {getDiscountAmount().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span>{getDeliveryFee() === 0 ? 'Free' : `KES ${getDeliveryFee().toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[#D4A5B8]">KES {getFinalTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-lg hover:shadow-md font-medium disabled:opacity-70 transition-all"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay KES ${getFinalTotal().toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3">
              {cart.map((item, index) => {
                const price = item.product.discountPrice || item.product.sellingPrice;
                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium whitespace-nowrap">KES {(price * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}

              <hr className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>KES {getCartTotal().toLocaleString()}</span>
                </div>
                {getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-KES {getDiscountAmount().toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span>{getDeliveryFee() === 0 ? <span className="text-green-600">Free</span> : `KES ${getDeliveryFee().toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#D4A5B8]">KES {getFinalTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}