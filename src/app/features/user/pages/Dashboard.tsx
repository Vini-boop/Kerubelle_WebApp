import { Link } from 'react-router-dom';
import { useStore } from '../../../providers/StoreProvider';

export function Dashboard() {
  const { orders } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/orders">
          <div className="bg-gradient-to-br from-[#FFF5F9] to-[#F8E8EE] p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800">My Orders</h3>
            <p className="text-3xl font-bold text-[#F8C8DC] mt-2">{orders.length}</p>
          </div>
        </Link>
        
        <Link to="/wishlist">
          <div className="bg-gradient-to-br from-[#FFF5F9] to-[#F8E8EE] p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800">Wishlist</h3>
            <p className="text-3xl font-bold text-[#F8C8DC] mt-2">0</p>
          </div>
        </Link>
        
        <Link to="/account">
          <div className="bg-gradient-to-br from-[#FFF5F9] to-[#F8E8EE] p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800">Account Settings</h3>
            <p className="text-3xl font-bold text-[#F8C8DC] mt-2">Manage</p>
          </div>
        </Link>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order: any, index: number) => (
              <Link key={index} to={`/order/${order.id}`}>
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium">Order #{order.id.substring(0, 8)}...</p>
                    <p className="text-gray-600 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <p className={`text-sm ${
                      order.status === 'Delivered' ? 'text-green-600' : 
                      order.status === 'Shipped' ? 'text-blue-600' : 
                      order.status === 'Processing' ? 'text-yellow-600' : 
                      'text-gray-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">You haven't placed any orders yet.</p>
            <Link to="/shop">
              <button className="mt-4 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                Start Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}