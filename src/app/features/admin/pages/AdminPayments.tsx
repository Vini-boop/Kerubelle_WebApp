import { useState } from 'react';
import { useStore } from '../../../providers/StoreProvider';
import { Search, DollarSign, TrendingUp, CreditCard, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPayments() {
    const store = useStore();
    const summary = store.getDashboardSummary();
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const payments = store.payments || [];
    const filtered = payments.filter(p =>
        p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transactionCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMarkPaid = async (orderId: string) => {
        setProcessingId(orderId);
        try {
            const result = await store.processPayment(orderId);
            if (result.success) {
                toast.success(`Payment processed for order ${orderId}`);
            } else {
                toast.error('Payment processing failed');
            }
        } catch {
            toast.error('Failed to process payment');
        } finally {
            setProcessingId(null);
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

    const cards = [
        { label: 'Total Revenue', value: `KES ${(summary.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Cost of Goods', value: `KES ${(summary.totalCostOfGoods || 0).toLocaleString()}`, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Net Profit', value: `KES ${(summary.netProfit || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Refunded', value: `KES ${(summary.refundedAmount || 0).toLocaleString()}`, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    // Pending orders that need payment action
    const pendingOrders = (store.orders || []).filter(o => o.paymentStatus === 'Pending');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
                    <p className="text-sm text-gray-500 mt-1">{payments.length} transactions · {pendingOrders.length} pending</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search payments…"
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 w-64"
                    />
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className={`${card.bg} rounded-xl p-4 border border-gray-100`}>
                            <div className="flex items-center gap-3">
                                <Icon className={`w-8 h-8 ${card.color}`} />
                                <div>
                                    <p className="text-xs text-gray-500">{card.label}</p>
                                    <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pending payment actions */}
            {pendingOrders.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {pendingOrders.length} order{pendingOrders.length > 1 ? 's' : ''} awaiting payment confirmation
                    </p>
                    <div className="space-y-2">
                        {pendingOrders.map(order => (
                            <div key={order.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-amber-100">
                                <div>
                                    <span className="font-semibold text-sm text-gray-800">{order.id}</span>
                                    <span className="text-gray-500 text-xs ml-2">{order.customerName} · KES {(order.total || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleMarkPaid(order.id)}
                                        disabled={processingId === order.id}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-3 h-3" />
                                        {processingId === order.id ? 'Processing…' : 'Mark Paid'}
                                    </button>
                                    <button
                                        onClick={() => handleMarkFailed(order.id)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                                    >
                                        <XCircle className="w-3 h-3" /> Failed
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payments table */}
            <div className="bg-white rounded-xl shadow-sm border border-[#F8C8DC]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#FDF8FA]">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Transaction</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Order</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Method</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(payment => (
                                <tr key={payment.id} className="hover:bg-[#FDF8FA]/50">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{payment.transactionCode}</td>
                                    <td className="px-4 py-3 text-gray-800">{payment.customer}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{payment.orderId}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${payment.method === 'M-Pesa' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {payment.method}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold">KES {(payment.amount || 0).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                payment.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    payment.status === 'Refunded' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {new Date(payment.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p>No payments found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
