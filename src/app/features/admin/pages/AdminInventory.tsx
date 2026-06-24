import { useState } from 'react';
import { useStore } from '../../../providers/StoreProvider';
import { Search, AlertTriangle, PlusCircle, Package } from 'lucide-react';
import { toast } from 'sonner';

export function AdminInventory() {
    const store = useStore();
    const inventory = store.getInventory();
    const [searchTerm, setSearchTerm] = useState('');
    const [restockId, setRestockId] = useState<string | null>(null);
    const [restockQty, setRestockQty] = useState('');

    const filtered = inventory.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRestock = (productId: string) => {
        const qty = parseInt(restockQty);
        if (isNaN(qty) || qty <= 0) {
            toast.error('Enter a valid quantity');
            return;
        }
        store.restockProduct(productId, qty);
        toast.success(`Restocked ${qty} units`);
        setRestockId(null);
        setRestockQty('');
    };

    const lowStockCount = inventory.filter(i => i.currentStock <= i.lowStockThreshold).length;
    const outOfStockCount = inventory.filter(i => i.currentStock === 0).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
                    <p className="text-sm text-gray-500 mt-1">{inventory.length} products tracked</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search inventory..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 w-64"
                    />
                </div>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                    <Package className="w-8 h-8 text-blue-500" />
                    <div>
                        <p className="text-xs text-gray-500">Total Products</p>
                        <p className="text-xl font-bold text-gray-800">{inventory.length}</p>
                    </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                    <div>
                        <p className="text-xs text-amber-600">Low Stock</p>
                        <p className="text-xl font-bold text-amber-700">{lowStockCount}</p>
                    </div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100 flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <div>
                        <p className="text-xs text-red-600">Out of Stock</p>
                        <p className="text-xl font-bold text-red-700">{outOfStockCount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#F8C8DC]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#FDF8FA]">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-600">Stock</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-600">Threshold</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Last Restocked</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(item => (
                                <tr key={item.productId} className="hover:bg-[#FDF8FA]/50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{item.productName}</td>
                                    <td className="px-4 py-3 text-center font-semibold">{item.currentStock}</td>
                                    <td className="px-4 py-3 text-center">
                                        {item.currentStock === 0 ? (
                                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Out of Stock</span>
                                        ) : item.currentStock <= item.lowStockThreshold ? (
                                            <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">Low Stock</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">In Stock</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-500">{item.lowStockThreshold}</td>
                                    <td className="px-4 py-3 text-gray-500">{item.lastRestocked}</td>
                                    <td className="px-4 py-3 text-center">
                                        {restockId === item.productId ? (
                                            <div className="flex items-center gap-2 justify-center">
                                                <input
                                                    type="number" value={restockQty} onChange={e => setRestockQty(e.target.value)}
                                                    placeholder="Qty" min="1"
                                                    className="w-16 px-2 py-1 border rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#F8C8DC]"
                                                />
                                                <button onClick={() => handleRestock(item.productId)} className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">Add</button>
                                                <button onClick={() => setRestockId(null)} className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">Cancel</button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setRestockId(item.productId)}
                                                className="px-3 py-1 border border-[#F8C8DC] text-[#D4A5B8] rounded-lg text-xs hover:bg-[#F8C8DC]/10 transition-colors flex items-center gap-1 mx-auto"
                                            >
                                                <PlusCircle className="w-3 h-3" /> Restock
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
