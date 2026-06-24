import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useStore } from '../providers/StoreProvider';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export function OrderTracking() {
  const { orderId } = useParams();
  const { orders } = useStore();

  const order = orders.find((o: any) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
          <Link to="/dashboard" className="text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors">
            View all orders
          </Link>
        </div>
      </div>
    );
  }

  const statuses = [
    { key: 'Processing', icon: Clock, label: 'Processing' },
    { key: 'Packed', icon: Package, label: 'Packed' },
    { key: 'Shipped', icon: Truck, label: 'Shipped' },
    { key: 'Out for Delivery', icon: Truck, label: 'Out for Delivery' },
    { key: 'Delivered', icon: CheckCircle, label: 'Delivered' },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Order Tracking
          </h1>
          <p className="text-gray-600">Order ID: {order.id}</p>
        </div>

        {/* Success Message */}
        <div className="bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-2xl p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="opacity-90">
            Thank you for your purchase. We'll send you updates via email.
          </p>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#F8C8DC]/10 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Order Status</h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200">
              <div
                className="bg-gradient-to-b from-[#F8C8DC] to-[#D4A5B8] transition-all duration-500"
                style={{
                  height: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Status Steps */}
            <div className="space-y-6 relative">
              {statuses.map((status, index) => {
                const Icon = status.icon;
                const isComplete = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={status.key} className="flex items-start gap-6">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                        isComplete
                          ? 'bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] text-white'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-[#F8C8DC]/20 scale-110' : ''}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1 pt-3">
                      <h3
                        className={`font-semibold ${
                          isComplete ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {status.label}
                      </h3>
                      {isCurrent && (
                        <p className="text-sm text-[#F8C8DC] mt-1">Current Status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#F8C8DC]/10 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
              <p className="font-semibold text-gray-900">{order.address}</p>
            </div>
          </div>

          <div className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <div
                key={`${item.product.id}-${item.color}-${item.size}-${index}`}
                className="flex gap-4 p-4 bg-[#FFF5F9] rounded-xl"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.color} • {item.size} • Qty: {item.quantity}
                  </p>
                  <p className="text-[#F8C8DC] font-semibold mt-1">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className="font-semibold">${order.delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-[#F8C8DC]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-[#FFF5F9] rounded-2xl p-6 text-center">
          <p className="text-gray-700 mb-4">
            Need help with your order?
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
