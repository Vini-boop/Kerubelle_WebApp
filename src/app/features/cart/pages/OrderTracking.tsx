import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useStore } from '../../../providers/StoreProvider';
import { Package } from 'lucide-react';

export function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, getProductById } = useStore();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find an order with that ID. Please check the order number and try again.</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Status progression for tracking
  const statusSteps = [
    { status: 'Processing', label: 'Order Placed' },
    { status: 'Packed', label: 'Packed & Ready' },
    { status: 'Shipped', label: 'Shipped' },
    { status: 'Out for Delivery', label: 'Out for Delivery' },
    { status: 'Delivered', label: 'Delivered' },
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.status === order.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Tracking</h1>

      <div className="bg-gray-50 p-6 rounded-xl mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
            <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-[#F8C8DC]">KES {order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tracking Progress */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status: <span className="text-[#F8C8DC]">{order.status}</span></h3>
        <div className="flex items-center justify-between relative">
          {/* Progress bar */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          <div
            className="absolute top-4 left-0 h-1 bg-[#F8C8DC] z-10 transition-all duration-500"
            style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
          ></div>

          {statusSteps.map((step, index) => (
            <div key={step.status} className="flex flex-col items-center z-20">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStatusIndex
                    ? 'bg-[#F8C8DC] text-white'
                    : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-sm text-center ${index <= currentStatusIndex ? 'text-[#F8C8DC] font-medium' : 'text-gray-500'
                  }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-50 p-6 rounded-xl mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h3>
        <p className="text-gray-600">{order.address}</p>
      </div>

      {/* Order Items */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item, index) => {
            const product = getProductById(item.productId);
            return (
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="aspect-square w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {product ? (
                    <img
                      src={product.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#F8C8DC]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.productName}</h4>
                  <p className="text-gray-600 text-sm">{item.color} • {item.size}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">KES {item.unitPrice.toFixed(2)}</p>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">KES {order.subtotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Delivery</p>
              <p className="font-medium">KES {order.delivery.toFixed(2)}</p>
            </div>
            {order.discount > 0 && (
              <div>
                <p className="text-gray-600">Discount</p>
                <p className="font-medium text-green-600">-KES {order.discount.toFixed(2)}</p>
              </div>
            )}
            <div>
              <p className="text-gray-800 font-medium">Total</p>
              <p className="font-bold text-[#F8C8DC]">KES {order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}