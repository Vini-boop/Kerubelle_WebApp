import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, Package, PlusCircle, ShoppingCart, Users, Warehouse,
    CreditCard, Tag, Receipt, Settings, Bell, DollarSign,
    ChevronLeft, ChevronRight, Menu, X, Check, Trash2, Moon, Sun,
} from 'lucide-react';
import { useNotifications } from '../../../providers/NotificationProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { useTheme } from '../../../providers/ThemeProvider';

const sidebarItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/add-product', label: 'Add New Handbag', icon: PlusCircle },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/inventory', label: 'Inventory', icon: Warehouse },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/promotions', label: 'Promotions', icon: Tag },
    { path: '/admin/expenses', label: 'Expenses', icon: Receipt },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [bellOpen, setBellOpen] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications();
    const [accountOpen, setAccountOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement | null>(null);

    const isActive = (path: string) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (accountOpen && accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
        }
        function onKeyDown(e: KeyboardEvent) { if (e.key === 'Escape') setAccountOpen(false); }
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKeyDown);
        return () => { document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onKeyDown); };
    }, [accountOpen]);

    const formatTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const getNotifIcon = (type: string) => {
        switch (type) {
            case 'order': return '🛍️';
            case 'payment': return '💳';
            case 'low-stock': return '⚠️';
            default: return 'ℹ️';
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="min-h-screen bg-[#FDF8FA] dark:bg-gray-950 flex flex-col transition-colors duration-200">

            {/* ── Top Navigation Bar ── */}
            <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-[#F8C8DC]/30 dark:border-gray-700/50 shadow-sm h-16 flex items-center px-4 lg:px-6 transition-colors duration-200">
                {/* Mobile menu toggle */}
                <button onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden p-2 mr-2 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    {mobileOpen
                        ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                </button>

                {/* Logo */}
                <Link to="/admin" className="flex items-center mr-8">
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] bg-clip-text text-transparent"
                        style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}>
                        KeruBelle
                    </span>
                </Link>

                {/* Right side */}
                <div className="flex items-center ml-auto space-x-2 sm:space-x-3">

                    {/* Dark mode toggle */}
                    <button onClick={toggleTheme} aria-label="Toggle dark mode"
                        className="p-2 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 rounded-full transition-colors">
                        {theme === 'dark'
                            ? <Sun className="w-5 h-5 text-yellow-400" />
                            : <Moon className="w-5 h-5 text-gray-500" />}
                    </button>

                    {/* Notification Bell */}
                    <div className="relative" ref={bellRef}>
                        <button onClick={() => setBellOpen(!bellOpen)}
                            className="relative p-2 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-[#F8C8DC]' : 'text-gray-500 dark:text-gray-400'}`} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {bellOpen && (
                            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-[#F8C8DC]/20 dark:border-gray-700 z-[100] overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#FFF5F9] dark:from-gray-800 to-white dark:to-gray-800">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Notifications</h3>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 && (
                                            <button onClick={markAllRead} className="text-xs text-[#D4A5B8] hover:text-[#F8C8DC] flex items-center gap-1 transition-colors">
                                                <Check className="w-3 h-3" /> Mark all read
                                            </button>
                                        )}
                                        {notifications.length > 0 && (
                                            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors">
                                                <Trash2 className="w-3 h-3" /> Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-10 text-center">
                                            <Bell className="w-10 h-10 text-gray-200 dark:text-gray-600 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400 dark:text-gray-500">No notifications yet</p>
                                            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">New order alerts will appear here</p>
                                        </div>
                                    ) : (
                                        notifications.slice(0, 20).map(notif => (
                                            <button key={notif.id} onClick={() => markAsRead(notif.id)}
                                                className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-gray-700 hover:bg-[#FFF5F9] dark:hover:bg-gray-700 transition-colors flex gap-3 ${!notif.read ? 'bg-[#FFF5F9]/60 dark:bg-gray-750' : ''}`}>
                                                <span className="text-lg flex-shrink-0 mt-0.5">{getNotifIcon(notif.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                                            {notif.title}
                                                        </p>
                                                        {!notif.read && <span className="w-2 h-2 bg-[#F8C8DC] rounded-full flex-shrink-0 mt-1.5" />}
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{notif.message}</p>
                                                    <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-1">{formatTime(notif.time)}</p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
                                        <Link to="/admin/settings" onClick={() => setBellOpen(false)}
                                            className="text-xs text-[#D4A5B8] hover:text-[#F8C8DC] transition-colors flex items-center justify-center gap-1">
                                            <Settings className="w-3 h-3" /> Notification Settings
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button className="relative p-2 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 rounded-full transition-colors hidden sm:flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">Payment Alert</span>
                    </button>

                    <div ref={accountRef} className="relative">
                        <button onClick={() => setAccountOpen(o => !o)}
                            className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-700 px-3 py-1 rounded-md hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] flex items-center justify-center text-white text-sm font-semibold">
                                {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD'}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">{user?.fullName || 'Admin'}</span>
                        </button>
                        {accountOpen && (
                            <div className="absolute right-0 mt-10 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[#F8C8DC]/10 dark:border-gray-700 z-50">
                                <button onClick={() => { setAccountOpen(false); handleLogout(); }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Mobile overlay */}
                {mobileOpen && (
                    <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed lg:static z-40 top-16 bottom-0 left-0
                    bg-white dark:bg-gray-900 border-r border-[#F8C8DC]/20 dark:border-gray-700/50 shadow-sm
                    flex flex-col transition-all duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${collapsed ? 'w-[72px]' : 'w-[240px]'}
                `}>
                    <nav className="flex-1 py-4 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                                    className={`
                                        flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium
                                        transition-all duration-200 group relative
                                        ${active
                                            ? 'bg-gradient-to-r from-[#F8C8DC] to-[#F0B8CC] text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-800 hover:text-[#D4A5B8]'}
                                    `}>
                                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-[#D4A5B8]'}`} />
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                    {collapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Collapse toggle */}
                    <div className="p-3 border-t border-[#F8C8DC]/20 dark:border-gray-700/50">
                        <button onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex items-center justify-center w-full py-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-800 hover:text-[#D4A5B8] transition-colors">
                            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
