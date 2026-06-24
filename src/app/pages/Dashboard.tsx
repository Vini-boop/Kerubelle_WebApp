import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useStore } from '../providers/StoreProvider';
import { useWishlist } from '../providers/WishlistProvider';
import { useCart } from '../providers/CartProvider';
import { useAuth } from '../providers/AuthProvider';
import {
  Package,
  MapPin,
  Heart,
  User,
  LogOut,
  Search,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  Truck,
  ShoppingBag,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import DashboardProfileModal from './DashboardProfileModal';
import DashboardAddressesModal from './DashboardAddressesModal';
import { PageLoader } from '../components/common/PageLoader';

export function Dashboard() {
  const { orders, getProductById, loading: storeLoading } = useStore();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuCollapsed, setMobileMenuCollapsed] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Memoized filtered orders — hooks must all be called before any early return
  const userOrders = useMemo(() => {
    let filtered = orders.filter(o => o.customerEmail === user?.email);

    // Filter by status
    if (orderFilter !== 'all') {
      filtered = filtered.filter(o => o.status === orderFilter);
    }

    // Search by order ID
    if (orderSearch) {
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(orderSearch.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [orders, user?.email, orderFilter, orderSearch, sortBy]);

  // Memoized stats
  const stats = useMemo(() => {
    const totalOrders = userOrders.length;
    const activeOrders = userOrders.filter(o => o.status !== 'Delivered').length;
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    const deliveredOrders = userOrders.filter(o => o.status === 'Delivered').length;

    return {
      totalOrders,
      activeOrders,
      totalSpent,
      deliveredOrders,
      wishlistItems: wishlist.length
    };
  }, [userOrders, wishlist.length]);

  // Get member since — use createdAt timestamp, fall back to current year
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Show branded loader while auth or store data is resolving — AFTER all hooks
  if (authLoading || storeLoading) return <PageLoader />;

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  // Sidebar navigation items
  const sidebarItems = [
    { icon: Package, label: 'My Orders', active: true },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: MapPin, label: 'Addresses', action: () => setAddressOpen(true) },
    { icon: User, label: 'Profile', action: () => setProfileOpen(true) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile Header */}
        <div className="lg:hidden mb-6 bg-white rounded-2xl p-4 shadow-lg border border-[#F8C8DC]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] rounded-full flex items-center justify-center">
                {user?.name ? (
                  <span className="text-lg font-bold text-white">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{user?.name || 'Member'}</h2>
                <p className="text-xs text-gray-500">{memberSince}</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuCollapsed(!mobileMenuCollapsed)}
              className="p-2 hover:bg-[#FFF5F9] rounded-lg transition-colors"
            >
              {mobileMenuCollapsed ? (
                <ChevronDown className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronUp className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Collapsible Mobile Menu */}
          {!mobileMenuCollapsed && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 animate-fade-in">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action?.();
                    setMobileMenuCollapsed(true);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active
                    ? 'bg-[#FFF5F9] text-[#F8C8DC] border-l-4 border-[#F8C8DC]'
                    : 'text-gray-600 hover:bg-[#FFF5F9] hover:text-[#F8C8DC]'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <Link
                to="/wishlist"
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-[#FFF5F9] hover:text-[#F8C8DC] rounded-lg transition-all"
                onClick={() => setMobileMenuCollapsed(true)}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Wishlist</span>
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all mt-4 pt-4 border-t border-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#F8C8DC]/10 backdrop-blur-sm sticky top-24">
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] rounded-full flex items-center justify-center mb-3 shadow-md">
                    {user?.name ? (
                      <span className="text-3xl font-bold text-white">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  {user?.emailVerified && (
                    <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{user?.name || user?.email?.split('@')[0] || 'Member'}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  Member since {memberSince}
                </p>
                {user?.emailVerified ? (
                  <span className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-xs text-orange-600 font-medium mt-1">Not verified</span>
                )}
              </div>

              {/* Navigation - Desktop */}
              <nav className="space-y-2 hidden lg:block">
                {sidebarItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action || (() => { })}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${item.active
                      ? 'bg-[#FFF5F9] text-[#F8C8DC] border-l-4 border-[#F8C8DC] shadow-sm'
                      : 'text-gray-600 hover:bg-[#FFF5F9] hover:text-[#F8C8DC]'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 ${item.active ? 'text-[#F8C8DC]' : 'group-hover:text-[#F8C8DC]'} transition-colors`} />
                    <span className="font-medium">{item.label}</span>
                    {item.path && <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                ))}
                <Link
                  to="/wishlist"
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-[#FFF5F9] hover:text-[#F8C8DC] rounded-lg transition-all duration-300 group"
                >
                  <Heart className="w-5 h-5 group-hover:text-[#F8C8DC]" />
                  <span className="font-medium">Wishlist</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 group mt-4 pt-4 border-t border-gray-100"
                >
                  <LogOut className="w-5 h-5 group-hover:text-red-600" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
              style={{ background: 'linear-gradient(135deg, #F8C8DC 0%, #D4A5B8 50%, #C490A8 100%)' }}>
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <p className="text-white/80 text-sm font-medium tracking-widest uppercase mb-1">Welcome back</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic' }}>
                    {getGreeting()}, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Valued Customer'} 👋
                  </h2>
                  <p className="text-white/75 text-sm">Here's a summary of your KeruBelle activity.</p>
                </div>
                <Link to="/shop"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-sm px-5 py-3 rounded-full transition-all hover:scale-105 whitespace-nowrap border border-white/30">
                  <ShoppingBag className="w-4 h-4" /> Shop Now
                </Link>
              </div>

              {/* Stats strip inside banner */}
              <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Orders', value: stats.totalOrders, icon: '📦' },
                  { label: 'Total Spent', value: `KES ${Intl.NumberFormat('en-KE').format(stats.totalSpent)}`, icon: '💳' },
                  { label: 'Wishlist', value: stats.wishlistItems, icon: '❤️' },
                  { label: 'Active Orders', value: stats.activeOrders, icon: '🚚' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/30 transition-all">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <p className="text-white font-bold text-xl leading-none mb-1">{s.value}</p>
                    <p className="text-white/70 text-xs font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Section with Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#F8C8DC]/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#F8C8DC]" />
                  My Orders
                </h2>

                <div className="flex flex-col sm:flex-row gap-3 overflow-x-auto pb-2">
                  {/* Search */}
                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search order ID..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FDF8FA] border border-[#F8C8DC]/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 transition-all"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-4 py-2 bg-white border border-[#F8C8DC]/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 cursor-pointer whitespace-nowrap"
                  >
                    <option value="all">All Orders</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-white border border-[#F8C8DC]/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 cursor-pointer whitespace-nowrap"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      getProductById={getProductById}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FFF5F9] to-[#F8C8DC]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-12 h-12 text-[#F8C8DC]" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No orders found</p>
                  {orderSearch || orderFilter !== 'all' ? (
                    <p className="text-sm text-gray-500">Try adjusting your filters</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 mb-4">You haven't placed any orders yet. Let's find something beautiful for you.</p>
                      <Link
                        to="/shop"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg transition-all duration-300"
                      >
                        Start Shopping
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Preview */}
            {wishlist.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-[#F8C8DC]/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#F8C8DC]" />
                    Wishlist
                  </h2>
                  <Link
                    to="/wishlist"
                    className="text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {wishlist.slice(0, 4).map((item, index) => (
                    <WishlistPreviewCard
                      key={item.product.id}
                      item={item}
                      onRemove={() => removeFromWishlist(item.product.id)}
                      onMoveToCart={() => {
                        const product = item.product;
                        if (product) {
                          const defaultColor = product.colors?.[0] || 'Pink';
                          const defaultSize = product.sizes?.[0] || 'Medium';
                          addToCart(product, defaultColor, defaultSize, 1);
                          removeFromWishlist(item.product.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DashboardProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <DashboardAddressesModal open={addressOpen} onClose={() => setAddressOpen(false)} />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Components

function OrderCard({ order, getProductById }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Packed':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const progressSteps = ['Processing', 'Packed', 'Shipped', 'Delivered'];
  const currentIndex = progressSteps.indexOf(order.status);

  return (
    <Link
      to={`/order/${order.id}`}
      className="block p-6 border border-[#F8C8DC]/20 rounded-xl hover:border-[#F8C8DC] hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <p className="font-semibold text-gray-900 mb-1">Order {order.id}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Progress Tracker - Hide on very small screens, show simplified version */}
      <div className="mb-4 hidden sm:block">
        <div className="flex items-center justify-between mb-2">
          {progressSteps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${index <= currentIndex ? 'bg-[#F8C8DC] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {index <= currentIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              {index < progressSteps.length - 1 && (
                <div className={`w-12 sm:w-20 h-1 mx-2 ${index < currentIndex ? 'bg-[#F8C8DC]' : 'bg-gray-200'
                  } rounded-full`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          {progressSteps.map(step => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </div>

      {/* Mobile Status Badge */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Truck className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
        {order.items.slice(0, 4).map((item: any, index: number) => {
          const product = getProductById(item.productId);
          return (
            <div
              key={`${item.productId}-${index}`}
              className="w-16 h-16 rounded-lg overflow-hidden bg-[#FFF5F9] flex-shrink-0 border border-[#F8C8DC]/20"
            >
              {product ? (
                <img
                  src={product.image}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#F8C8DC]" />
                </div>
              )}
            </div>
          );
        })}
        {order.items.length > 4 && (
          <div className="w-16 h-16 rounded-lg bg-[#FFF5F9] border border-[#F8C8DC]/20 flex items-center justify-center text-sm text-gray-600 flex-shrink-0">
            +{order.items.length - 4}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-600">
            {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
          </p>
        </div>
        <p className="font-semibold text-[#F8C8DC] text-lg">
          KES {order.total.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

function WishlistPreviewCard({ item, onRemove, onMoveToCart }: any) {
  const discount = item.product.originalPrice && item.product.sellingPrice
    ? Math.round(((item.product.originalPrice - item.product.sellingPrice) / item.product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#F8C8DC] hover:shadow-lg transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-[#FFF5F9]">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.preventDefault(); onMoveToCart(); }}
            className="bg-white text-gray-900 px-3 py-2 rounded-full text-xs font-medium hover:bg-[#F8C8DC] transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onRemove(); }}
            className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate mb-1">{item.product.name}</p>
        <p className="text-sm text-[#F8C8DC] font-semibold">
          KES {(item.product.sellingPrice || 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
