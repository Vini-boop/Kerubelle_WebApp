import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../providers/CartProvider';
import { useStore } from '../providers/StoreProvider';
import { Check, CreditCard, Smartphone, MapPin, Info } from 'lucide-react';
import { toast } from 'sonner';

// Eldoret Areas for free delivery
const ELDORET_AREAS = [
  'Select Area',
  'Huduma Centre',
  'Town Centre',
  'Kambi Sam',
  'Huruma',
  'Kapsoya',
  'Moi University',
  'Chepkoilel',
  'Stadium',
  'Maili Nne',
  'Kapsabet Road',
  'Uganda Road',
  'Jamhuri Park',
  'Central Market',
  'Railways',
  'Pioneer',
  'Eldoret West',
  'Langas',
  'Pipeline',
  'Kiminini',
  'Other (Outside Eldoret)'
];

const DELIVERY_COST_OUTSIDE_ELDORET = 15;

export function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { createOrder } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    area: 'Select Area', // Eldoret area dropdown
    streetAddress: '', // Specific location within area
    landmark: '', // Optional landmark
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [mpesaPhone, setMpesaPhone] = useState('');

  // Calculate delivery cost based on location
  const isInsideEldoret = formData.area !== 'Other (Outside Eldoret)' && formData.area !== 'Select Area';
  const deliveryCost = isInsideEldoret ? 0 : DELIVERY_COST_OUTSIDE_ELDORET;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.area === 'Select Area') {
      toast.error('Please select your delivery area');
      return;
    }

    if (!formData.streetAddress.trim()) {
      toast.error('Please provide specific location/street address');
      return;
    }

    if (paymentMethod === 'card' && (!cardData.cardNumber || !cardData.expiry || !cardData.cvv)) {
      toast.error('Please complete payment information');
      return;
    }

    if (paymentMethod === 'mpesa' && !mpesaPhone) {
      toast.error('Please enter M-Pesa phone number');
      return;
    }

    // Generate order ID
    const orderId = `PB-2026-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    
    // Create complete address string
    const fullAddress = `${formData.streetAddress}, ${formData.area}${formData.landmark ? ', Near ' + formData.landmark : ''}, Eldoret`;
    
    // Create order using StoreProvider
    try {
      await createOrder({
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
        address: fullAddress,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        paymentMethod: paymentMethod === 'card' ? 'Card' : 'M-Pesa',
      });
      
      clearCart();
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Error creating order:', error);
      return;
    }

    toast.success('Order placed successfully!');
    
    // Navigate to dashboard after successful order
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F8C8DC]/10">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F8C8DC]/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#F8C8DC]" />
                    Delivery Address
                  </h2>
                  {isInsideEldoret && (
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      ✓ Free Delivery
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Area Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Area *
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent bg-white"
                      required
                    >
                      {ELDORET_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area} {area === 'Other (Outside Eldoret)' ? '(KES 150 delivery fee)' : area === 'Select Area' ? '' : '(Free Delivery)'}
                        </option>
                      ))}
                    </select>
                    {isInsideEldoret && (
                      <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Great! You qualify for FREE delivery within Eldoret
                      </p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Location / Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                      placeholder="e.g., House No. 123, Uganda Road or Mall Name & Shop Number"
                    />
                    <p className="mt-1 text-xs text-gray-500">Be as specific as possible for easy location</p>
                  </div>

                  {/* Landmark (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nearby Landmark <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                      placeholder="e.g., Near Huduma Centre, Opposite Total Petrol Station"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <div className="flex gap-2">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium mb-1">Delivery Information:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• <strong>Free delivery</strong> to all areas within Eldoret</li>
                          <li>• <strong>KES 150 fee</strong> for locations outside Eldoret</li>
                          <li>• Orders processed within 1-2 business days</li>
                          <li>• Pickup available at: KeruBlush Stores, Eld Room 34, Opposite Huduma Center</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F8C8DC]/10">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Payment Method
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'card'
                        ? 'border-[#F8C8DC] bg-[#FFF5F9]'
                        : 'border-gray-200 hover:border-[#F8C8DC]'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-[#F8C8DC]" />
                    <span className="font-medium">Credit Card</span>
                    {paymentMethod === 'card' && (
                      <Check className="w-5 h-5 text-[#F8C8DC]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'mpesa'
                        ? 'border-[#F8C8DC] bg-[#FFF5F9]'
                        : 'border-gray-200 hover:border-[#F8C8DC]'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 text-[#F8C8DC]" />
                    <span className="font-medium">M-Pesa</span>
                    {paymentMethod === 'mpesa' && (
                      <Check className="w-5 h-5 text-[#F8C8DC]" />
                    )}
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) =>
                          setCardData({ ...cardData, cardNumber: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) =>
                            setCardData({ ...cardData, expiry: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                          placeholder="MM/YY"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({ ...cardData, cvv: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'mpesa' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      M-Pesa Phone Number
                    </label>
                    <input
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent"
                      placeholder="+254 700 000 000"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      You will receive a prompt on your phone to complete payment
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-[#F8C8DC]/10">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.product.id}-${item.color}-${item.size}-${index}`}
                      className="flex gap-3"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#FFF5F9] flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.color} • {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-[#F8C8DC] mt-1">
                          ${(item.product.sellingPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={`font-semibold ${deliveryCost === 0 ? 'text-green-600' : ''}`}>
                      {deliveryCost === 0 ? 'FREE' : `KES ${deliveryCost.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#F8C8DC]">KES {total.toLocaleString()}</span>
                  </div>
                  {deliveryCost === 0 && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" /> You're saving KES {DELIVERY_COST_OUTSIDE_ELDORET.toLocaleString()} with free delivery!
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Place Order
                </button>

                <p className="mt-4 text-xs text-center text-gray-600">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
