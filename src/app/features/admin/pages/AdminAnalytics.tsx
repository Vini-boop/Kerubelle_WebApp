import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { useStore } from '../../../providers/StoreProvider';

const PIE_COLORS = ['#F8C8DC', '#D4A5B8', '#E8B4C8', '#C9939F', '#F5E0E8'];

export function AdminAnalytics() {
    const store = useStore();

    // All data from live store — no mock data
    const revenueByMonth = store.getRevenueByMonth();
    const salesByCategory = store.getSalesByCategory();
    const profitTrend = store.getProfitTrend();
    const customerGrowth = store.getCustomerGrowth();
    const weeklySales = store.getWeeklySales();
    const bestSellers = store.getBestSellers().slice(0, 5).map(p => ({
        name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
        sold: p.salesCount,
    }));

    const isEmpty = (arr: any[]) => !arr || arr.length === 0 || arr.every(i => !i || (typeof i === 'object' && Object.values(i).every(v => v === 0 || v === '')));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Live insights from your store data.</p>
                </div>
                <button
                    onClick={() => store.refreshData()}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#D4A5B8] border border-[#F8C8DC]/40 rounded-full hover:bg-[#F8C8DC]/10 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {store.loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm animate-pulse">
                            <div className="h-4 w-32 bg-[#F8C8DC]/30 rounded mb-4" />
                            <div className="h-[200px] bg-[#FFF5F9] rounded-xl" />
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Best-selling Handbags */}
                <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Best-selling Handbags</h3>
                    {isEmpty(bestSellers) ? (
                        <p className="text-xs text-gray-400 text-center py-8">No sales data yet</p>
                    ) : (
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
                    {isEmpty(revenueByMonth) ? (
                        <p className="text-xs text-gray-400 text-center py-8">No revenue data yet</p>
                    ) : (
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
                    {isEmpty(salesByCategory) ? (
                        <p className="text-xs text-gray-400 text-center py-8">No category data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={salesByCategory} cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3} dataKey="sales" nameKey="category">
                                    {salesByCategory.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill || PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => [v, 'Units']} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Weekly Sales */}
                <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Weekly Sales</h3>
                    {isEmpty(weeklySales) ? (
                        <p className="text-xs text-gray-400 text-center py-8">No weekly data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={weeklySales}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0e4e8" />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={d => d.slice(0, 3)} />
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
                    {isEmpty(customerGrowth) ? (
                        <p className="text-xs text-gray-400 text-center py-8">No customer data yet</p>
                    ) : (
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
                    {isEmpty(profitTrend) ? (
                        <p className="text-xs text-gray-400 text-center py-8">No profit data yet</p>
                    ) : (
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
    );
}
