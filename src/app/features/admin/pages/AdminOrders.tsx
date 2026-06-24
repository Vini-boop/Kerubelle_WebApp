import { useState } from 'react';
import { useStore } from '../../../providers/StoreProvider';
import { Search, CheckCircle, Clock, Truck, Package, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { OrderStatus } from '../../../shared/types/types';
import { toast } from 'sonner';

const statusOptions = ['Processing', 'Packed', 'Shipped', 'Delivered'] as const;
type StatusOption = typeof statusOptions[number];

const statusColors: Record<string, string> = {
    Processing: 'bg-blue-100 text-blue-700',
    Packed: 'bg-indigo-100 text-indigo-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
};
const paymentColors: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700',
    Pending: 'bg-amber-100 text-amber-700',
    Failed: 'bg-red-100 text-red-700',
    Refunded: 'bg-gray-100 text-gray-700',
};
const statusIcons: Record<string, any> = {
    Processing: Clock, Packed: Package, Shipped: Truck, Delivered: CheckCircle,
};

export function AdminOrders() {
    const store = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [processingPayment, setProcessingPayment] = useState<string | null>(null);

    const orders = store.orders || [];
    const filtered = orders.filter(o => {
        const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = !statusFilter || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleStatusChange = async (orderId: string, newStatus: StatusOption) => {
        try {
            await store.updateOrderStatus(orderId, newStatus as OrderStatus);
            toast.success(`Order ${orderId} → ${newStatus}`);
        } catch {
            toast.error('Failed to update order status');
        }
    };

    const handleMarkPaid = async (orderId: string) => {
        setProcessingPayment(orderId);
        try {
            const result = await store.processPayment(orderId);
            if (result.success) {
                toast.success(`Payment processed for ${orderId}`);
            } else {
                toast.error('Payment processing failed');
            }
        } catch {
            toast.error('Failed to process payment');
        } finally {
            setProcessingPayment(null);
        }
    };

    const handleMarkFailed = async (orderId: string) => {
        try {
            await store.markPaymentFailed(orderId);
            toast.success(`Order ${orderId} marked as payment failed`);
        } catch {
            toast.error('Failed to update payment status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
                </div>
                <div className="flex gap-3 items-center flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by ID or customer…"
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 w-56"
                        />
                    </div>
                    <select
                        value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 bg-white"
                    >
                        <option value="">All Statuses</option>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#F8C8DC]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-[#FDF8FA] to-[#FFF5F9] border-b border-[#F8C8DC]/20">
                            <tr>
                                <th className="text-left px-4 py-4 font-semibold text-gray-700 w-8" />
                                <th className="text-left px-4 py-4 font-semibold text-gray-700">Order ID</th>
                                <th className="text-left px-4 py-4 font-semibold text-gray-700">Customer</th>
                                <th className="text-left px-4 py-4 font-semibold text-gray-700">Date</th>
                                <th className="text-right px-4 py-4 font-semibold text-gray-700">Total</th>
                                <th className="text-center px-4 py-4 font-semibold text-gray-700">Payment</th>
                                <th className="text-center px-4 py-4 font-semibold text-gray-700">Status</th>
                                <th className="text-center px-4 py-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(order => {
                                const StatusIcon = statusIcons[order.status] || Clock;
                                const isExpanded = expandedId === order.id;
                                return (
                                    <>
                                        <tr key={order.id} className="hover:bg-[#FFF5F9]/30 transition-colors">
                                            {/* Expand toggle */}
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    {isExpanded
                                                        ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                                        : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-800">{order.id}</td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-800">{order.customerName}</p>
                                                <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                KES {(order.total || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${paymentColors[order.paymentStatus] || ''}`}>
                                                    {order.paymentStatus === 'Paid' && <CheckCircle className="w-3 h-3" />}
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || ''}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 justify-center flex-wrap">
                                                    {/* Fulfillment status */}
                                                    <select
                                                        value={order.status}
                                                        onChange={e => handleStatusChange(order.id, e.target.value as StatusOption)}
                                                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 bg-white cursor-pointer hover:border-[#F8C8DC] transition-all"
                                                    >
                                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>

                                                    {/* Payment actions */}
                                                    {order.paymentStatus === 'Pending' && (
                                                        <button
                                                            onClick={() => handleMarkPaid(order.id)}
                                                            disabled={processingPayment === order.id}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                                                        >
                                                            <CreditCard className="w-3 h-3" />
                                                            {processingPayment === order.id ? '…' : 'Mark Paid'}
                                                        </button>
                                                    )}
                                                    {order.paymentStatus === 'Pending' && (
                                                        <button
                                                            onClick={() => handleMarkFailed(order.id)}
                                                            className="px-2.5 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                                                        >
                                                            Failed
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded row — order items */}
                                        {isExpanded && (
                                            <tr key={`${order.id}-expanded`} className="bg-[#FFF5F9]/40">
                                                <td colSpan={8} className="px-8 py-4">
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</p>
                                                        {(order.items || []).map((item, i) => (
                                                            <div key={i} className="flex items-center justify-between text-sm bg-white rounded-lg px-4 py-2 border border-gray-100">
                                                                <span className="font-medium text-gray-800">{item.productName}</span>
                                                                <div className="flex items-center gap-6 text-gray-500 text-xs">
                                                                    <span>Qty: <strong className="text-gray-700">{item.quantity}</strong></span>
                                                                    <span>Unit: <strong className="text-gray-700">KES {(item.unitPrice || 0).toLocaleString()}</strong></span>
                                                                    <span>Color: <strong className="text-gray-700">{item.color || '—'}</strong></span>
                                                                    <span>Size: <strong className="text-gray-700">{item.size || '—'}</strong></span>
                                                                    <span className="font-semibold text-[#D4A5B8]">KES {((item.unitPrice || 0) * (item.quantity || 0)).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-between text-xs text-gray-500 pt-2 px-4">
                                                            <span>Address: {order.address}</span>
                                                            <span>Delivery: KES {(order.delivery || 0).toLocaleString()} | Discount: KES {(order.discount || 0).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 font-medium">No orders found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
