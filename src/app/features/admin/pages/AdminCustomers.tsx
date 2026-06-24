import { Search, Mail, Phone, ShoppingBag, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../../providers/StoreProvider';

export function AdminCustomers() {
    const store = useStore();
    const [search, setSearch] = useState('');

    // Safely handle undefined customers
    const customers = store.customers || [];
    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
                    <p className="text-sm text-gray-500 mt-1">View and manage your customer base.</p>
                </div>
                <button
                    onClick={() => store.refreshData()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm text-center">
                    <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Customers</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm text-center">
                    <p className="text-2xl font-bold text-gray-800">
                        KES {customers.reduce((s, c) => s + (c.totalSpent || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total Revenue from Customers</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm text-center">
                    <p className="text-2xl font-bold text-gray-800">
                        {customers.length > 0 ? (customers.reduce((s, c) => s + (c.totalOrders || 0), 0) / customers.length).toFixed(1) : '0'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Avg Orders per Customer</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search customers..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                />
            </div>

            {/* Customer Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-sm">{search ? 'No customers match your search.' : 'No customers yet.'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((customer) => (
                        <div key={customer.id} className="bg-white rounded-2xl p-5 border border-[#F8C8DC]/20 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] flex items-center justify-center text-white font-semibold text-sm">
                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-800 text-sm truncate">{customer.name}</h3>
                                        {customer.totalOrders === 0 && (
                                            <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">New</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Joined {new Date(customer.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Phone className="w-3.5 h-3.5 flex-shrink-0" /> {customer.phone || '—'}
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" /> {customer.totalOrders} order{customer.totalOrders !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Total Spent</span>
                                <span className="font-bold text-gray-800 text-sm">KES {(customer.totalSpent || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
