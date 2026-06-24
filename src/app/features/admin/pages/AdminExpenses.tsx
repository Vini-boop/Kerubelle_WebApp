import { useState } from 'react';
import { useStore } from '../../../providers/StoreProvider';
import { Plus, Trash2, DollarSign, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const expenseCategories = ['Shipping', 'Marketing', 'Operations', 'Utilities', 'Packaging', 'Other'];

export function AdminExpenses() {
    const store = useStore();
    const summary = store.getDashboardSummary();
    const [showForm, setShowForm] = useState(false);
    const [category, setCategory] = useState('Shipping');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAdd = () => {
        const amt = parseFloat(amount);
        if (!description || isNaN(amt) || amt <= 0) {
            toast.error('Fill in all fields with valid data');
            return;
        }
        store.addExpense({ category, description, amount: amt, date });
        toast.success('Expense added');
        setDescription('');
        setAmount('');
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        store.deleteExpense(id);
        toast.success('Expense deleted');
    };

    // Safely handle undefined expenses
    const expenses = store.expenses || [];
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
                    <p className="text-sm text-gray-500 mt-1">{expenses.length} expenses recorded</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-lg text-sm font-medium hover:shadow-md flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Expense
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                    <TrendingDown className="w-8 h-8 text-red-500" />
                    <div>
                        <p className="text-xs text-gray-500">Total Expenses</p>
                        <p className="text-xl font-bold text-red-600">KES {totalExpenses.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-500" />
                    <div>
                        <p className="text-xs text-gray-500">Revenue</p>
                        <p className="text-xl font-bold text-green-600">KES {(summary.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-emerald-500" />
                    <div>
                        <p className="text-xs text-gray-500">Net Profit</p>
                        <p className={`text-xl font-bold ${(summary.netProfit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            KES {(summary.netProfit || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F8C8DC]/10">
                    <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                            {expenseCategories.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <input value={description} onChange={e => setDescription(e.target.value)}
                            placeholder="Description" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                            placeholder="Amount (KES)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleAdd} className="px-4 py-2 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-lg text-sm font-medium">Save</button>
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-[#F8C8DC]/10 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#FDF8FA]">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                            <th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {expenses.map(expense => (
                            <tr key={expense.id} className="hover:bg-[#FDF8FA]/50">
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 rounded-full text-xs bg-[#F8C8DC]/20 text-[#D4A5B8]">{expense.category}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-800">{expense.description}</td>
                                <td className="px-4 py-3 text-right font-semibold text-red-600">KES {(expense.amount || 0).toLocaleString()}</td>
                                <td className="px-4 py-3 text-gray-500">{expense.date}</td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => handleDelete(expense.id)} className="p-1 text-red-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {expenses.length === 0 && <div className="text-center py-12 text-gray-400"><p>No expenses recorded</p></div>}
            </div>
        </div>
    );
}
