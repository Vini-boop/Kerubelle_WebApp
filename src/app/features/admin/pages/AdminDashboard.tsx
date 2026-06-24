import { useStore } from '../../../providers/StoreProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    TrendingUp, Package, ShoppingCart, Users, DollarSign,
    AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw,
    BarChart2, Activity, Zap, Eye, CheckCircle2, X,
} from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const PIE_COLORS = ['#F8C8DC', '#D4A5B8', '#E8B4C8', '#C9939F', '#F5E0E8'];

// ── Animated counter hook ──────────────────────────────────────
function useCountUp(target: number, duration = 1200, delay = 0) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        let start: number;
        let raf: number;
        const timeout = setTimeout(() => {
            const step = (ts: number) => {
                if (!start) start = ts;
                const progress = Math.min((ts - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setValue(Math.floor(eased * target));
                if (progress < 1) raf = requestAnimationFrame(step);
                else setValue(target);
            };
            raf = requestAnimationFrame(step);
        }, delay);
        return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
    }, [target, duration, delay]);
    return value;
}

// ── KPI Card ──────────────────────────────────────────────────
function KpiCard({ card, idx }: { card: any; idx: number }) {
    const Icon = card.icon;
    const numericVal = parseFloat(String(card.value).replace(/[^0-9.]/g, '')) || 0;
    const isKES = card.value.toString().startsWith('KES');
    const animated = useCountUp(numericVal, 1000, idx * 120);
    const displayVal = isKES ? `KSh ${animated.toLocaleString()}` : animated.toLocaleString();
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease forwards`, animationDelay: `${idx * 100}ms` }}>
            <Icon className={`w-12 h-12 mb-3 ${card.iconColor}`} />
            <p className="text-xs text-gray-400 font-medium mb-1">{card.label}</p>
            <p className="text-lg font-bold text-gray-900 leading-tight tabular-nums">{displayVal}</p>
            <div className={`flex items-center justify-center gap-1 mt-2 text-xs font-semibold ${card.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
            </div>
        </div>
    );
}

export function AdminDashboard() {
    const store = useStore();
    const { user } = useAuth();
    const location = useLocation();
    const summary = store.getDashboardSummary();
    const lowStock = store.getLowStockProducts();
    const recentOrders = (store.orders || []).slice(0, 6);
    const weeklySales = store.getWeeklySales();
    const paymentBreakdown = store.getPaymentMethodBreakdown();

    // Analytics data
    const revenueByMonth = store.getRevenueByMonth();
    const salesByCategory = store.getSalesByCategory();
    const profitTrend = store.getProfitTrend();
    const customerGrowth = store.getCustomerGrowth();
    const bestSellers = store.getBestSellers().slice(0, 5).map((p: any) => ({
        name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
        sold: p.salesCount,
    }));

    // New product banner
    const [newProductBanner, setNewProductBanner] = useState<any>(
        (location.state as any)?.newProduct ?? null
    );
    useEffect(() => {
        if (newProductBanner) {
            const t = setTimeout(() => setNewProductBanner(null), 6000);
            store.refreshData();
            return () => clearTimeout(t);
        }
    }, [newProductBanner]);

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const kpiCards = [
        { label: 'Total Revenue', value: `KES ${(summary.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, iconColor: 'text-emerald-500', trend: '+12%', positive: true },
        { label: 'Total Orders', value: (summary.totalOrders || 0).toString(), icon: ShoppingCart, iconColor: 'text-blue-500', trend: '+8%', positive: true },
        { label: 'Net Profit', value: `KES ${(summary.netProfit || 0).toLocaleString()}`, icon: TrendingUp, iconColor: 'text-violet-500', trend: '+18%', positive: true },
        { label: 'Total Customers', value: (summary.totalCustomers || 0).toString(), icon: Users, iconColor: 'text-orange-500', trend: '+15%', positive: true },
        { label: 'Products', value: (summary.totalProducts || 0).toString(), icon: Package, iconColor: 'text-pink-500', trend: '+5%', positive: true },
        { label: 'Pending Payments', value: `KES ${(summary.pendingPayments || 0).toLocaleString()}`, icon: AlertTriangle, iconColor: 'text-amber-500', trend: '-3%', positive: false },
    ];

    const maxSales = Math.max(...weeklySales.map((d: any) => d.sales), 1);
    const isEmpty = (arr: any[]) => !arr || arr.length === 0 || arr.every((i: any) => !i || Object.values(i).every(v => v === 0 || v === ''));

    return (
        <div className="space-y-6 bg-[#F8FAFC] min-h-screen -m-4 lg:-m-6 p-4 lg:p-6">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Overview</p>
                    <h1 className="text-2xl font-bold text-gray-900">{greeting}, {user?.name?.split(' ')[0] || 'Admin'}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => store.refreshData()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <Link to="/admin/add-product"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-sm">
                        <Zap className="w-4 h-4" /> Quick Add
                    </Link>
                </div>
            </div>

            {/* ── Product Added Banner ── */}
            {newProductBanner && (
                <div className="flex items-center gap-4 bg-white border border-green-200 rounded-2xl p-4 shadow-md animate-fade-in">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                        <img src={newProductBanner.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'} alt={newProductBanner.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-semibold text-green-700">Product added successfully!</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 truncate">{newProductBanner.name}</p>
                        <p className="text-xs text-gray-500">
                            {newProductBanner.type} · KES {(newProductBanner.sellingPrice || 0).toLocaleString()} · Stock: {newProductBanner.stock}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link to="/admin/products" className="text-xs font-semibold text-[#D4A5B8] hover:text-[#F8C8DC]">View all →</Link>
                        <button onClick={() => setNewProductBanner(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpiCards.map((card, idx) => <KpiCard key={idx} card={card} idx={idx} />)}
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* ── Weekly Sales + Payments ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-gray-400" />
                            <h2 className="font-semibold text-gray-800">Weekly Sales</h2>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">This week</span>
                    </div>
                    <div className="flex items-end gap-2 h-40">
                        {weeklySales.map((day: any, idx: number) => {
                            const pct = (day.sales / maxSales) * 100;
                            const isToday = idx === new Date().getDay();
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-gray-400">{day.sales > 0 ? `${Math.round(day.sales / 1000)}k` : ''}</span>
                                    <div className="w-full rounded-t-lg transition-all duration-500 relative group"
                                        style={{ height: `${Math.max(pct, 4)}%`, background: isToday ? 'linear-gradient(to top,#1a1a2e,#4a4a8a)' : 'linear-gradient(to top,#e2e8f0,#cbd5e1)' }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            KES {day.sales.toLocaleString()}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-medium ${isToday ? 'text-gray-900' : 'text-gray-400'}`}>{day.day.slice(0, 3)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-gray-400" />
                        <h2 className="font-semibold text-gray-800">Payments</h2>
                    </div>
                    <div className="space-y-4 mb-6">
                        {paymentBreakdown.map((method: any, idx: number) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-gray-600 font-medium">{method.name}</span>
                                    <span className="font-bold text-gray-900">{method.value}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className={`h-full rounded-full ${method.name === 'M-Pesa' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                        style={{ width: `${method.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                        {[
                            { label: 'Cost of Goods', value: summary.totalCostOfGoods || 0 },
                            { label: 'Expenses', value: summary.totalExpenses || 0 },
                            { label: 'Refunded', value: summary.refundedAmount || 0, red: true },
                        ].map(row => (
                            <div key={row.label} className="flex justify-between text-sm">
                                <span className="text-gray-400">{row.label}</span>
                                <span className={`font-semibold ${row.red ? 'text-red-500' : 'text-gray-700'}`}>KES {row.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Recent Orders + Low Stock ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">View all <Eye className="w-3 h-3" /></Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentOrders.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-400 text-sm">No orders yet</div>
                        ) : recentOrders.map((order: any) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {order.customerName?.[0] || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{order.customerName}</p>
                                        <p className="text-xs text-gray-400">{order.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">KES {(order.total || 0).toLocaleString()}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : order.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <h2 className="font-semibold text-gray-800">Low Stock Alerts</h2>
                        </div>
                        <Link to="/admin/inventory" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">Manage <Eye className="w-3 h-3" /></Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {lowStock.length === 0 ? (
                            <div className="px-6 py-10 text-center">
                                <p className="text-emerald-600 font-medium text-sm">All products well stocked 🎉</p>
                            </div>
                        ) : lowStock.slice(0, 6).map((product: any) => (
                            <div key={product.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">{product.name}</p>
                                        <p className="text-xs text-gray-400">{product.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                                        {product.stock === 0 ? 'Out' : `${product.stock} left`}
                                    </span>
                                    <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                                        <div className={`h-full rounded-full ${product.stock === 0 ? 'bg-red-400' : 'bg-amber-400'}`}
                                            style={{ width: `${Math.min(100, (product.stock / 10) * 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                ANALYTICS SECTION
            ══════════════════════════════════════════════════════════ */}
            <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Live insights from your store data</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {/* Best-selling Handbags */}
                    <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Best-selling Handbags</h3>
                        {isEmpty(bestSellers) ? <p className="text-xs text-gray-400 text-center py-8">No sales data yet</p> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={bestSellers} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e4e8" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} width={100} />
                                    <Tooltip formatter={(v: number) => [v, 'Units Sold']} contentStyle={{ borderRadius: '12px', border: '1px solid #F8C8DC' }} />
                                    <Bar dataKey="sold" fill="#F8C8DC" radius={[0, 6, 6, 0]} barSize={18} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Monthly Revenue */}
                    <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
                        {isEmpty(revenueByMonth) ? <p className="text-xs text-gray-400 text-center py-8">No revenue data yet</p> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={revenueByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e4e8" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #F8C8DC' }} />
                                    <Line type="monotone" dataKey="revenue" stroke="#D4A5B8" strokeWidth={2.5} dot={{ fill: '#D4A5B8', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Sales by Category */}
                    <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Sales by Category</h3>
                        {isEmpty(salesByCategory) ? <p className="text-xs text-gray-400 text-center py-8">No category data yet</p> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={salesByCategory} cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3} dataKey="sales" nameKey="category">
                                        {salesByCategory.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(v: number) => [v, 'Units']} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Weekly Sales Chart */}
                    <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Weekly Sales</h3>
                        {isEmpty(weeklySales) ? <p className="text-xs text-gray-400 text-center py-8">No weekly data yet</p> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={weeklySales}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e4e8" />
                                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={(d: string) => d.slice(0, 3)} />
                                    <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Sales']} contentStyle={{ borderRadius: '12px', border: '1px solid #F8C8DC' }} />
                                    <Bar dataKey="sales" fill="#E8B4C8" radius={[6, 6, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Customer Growth */}
                    <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Customer Growth</h3>
                        {isEmpty(customerGrowth) ? <p className="text-xs text-gray-400 text-center py-8">No customer data yet</p> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={customerGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e4e8" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(v: number) => [v, 'Customers']} contentStyle={{ borderRadius: '12px', border: '1px solid #F8C8DC' }} />
                                    <Line type="monotone" dataKey="customers" stroke="#C9939F" strokeWidth={2.5} dot={{ fill: '#C9939F', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Profit Trend */}
                    <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#D4A5B8]" /> Profit Trend
                        </h3>
                        {isEmpty(profitTrend) ? <p className="text-xs text-gray-400 text-center py-8">No profit data yet</p> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={profitTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e4e8" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Profit']} contentStyle={{ borderRadius: '12px', border: '1px solid #F8C8DC' }} />
                                    <Line type="monotone" dataKey="profit" stroke="#F8C8DC" strokeWidth={2.5} dot={{ fill: '#F8C8DC', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
