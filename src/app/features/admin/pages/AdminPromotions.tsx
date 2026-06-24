import { useState } from 'react';
import { Tag, Plus, ToggleLeft, ToggleRight, Copy, CheckCircle, Trash2, X } from 'lucide-react';
import { useStore } from '../../../providers/StoreProvider';
import { toast } from 'sonner';

const emptyForm = {
    code: '', description: '', discountPercent: '', maxUsage: '100',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    active: true,
};

export function AdminPromotions() {
    const store = useStore();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [saving, setSaving] = useState(false);

    const togglePromo = async (id: string) => {
        const promo = store.promotions.find(p => p.id === id);
        if (!promo) return;
        try {
            await store.updatePromotion(id, { active: !promo.active });
            toast.success(promo.active ? 'Promo deactivated' : 'Promo activated');
        } catch {
            toast.error('Failed to toggle promotion');
        }
    };

    const handleDelete = async (id: string, code: string) => {
        if (!confirm(`Delete promo code "${code}"? This cannot be undone.`)) return;
        try {
            await store.deletePromotion(id);
            toast.success(`Promo "${code}" deleted`);
        } catch {
            toast.error('Failed to delete promotion');
        }
    };

    const handleCreate = async () => {
        if (!form.code.trim() || !form.discountPercent) {
            toast.error('Code and discount % are required');
            return;
        }
        setSaving(true);
        try {
            await store.addPromotion({
                code: form.code.trim().toUpperCase(),
                description: form.description,
                discountPercent: parseFloat(form.discountPercent),
                usageCount: 0,
                maxUsage: parseInt(form.maxUsage) || 100,
                startDate: form.startDate,
                endDate: form.endDate,
                active: form.active,
            });
            toast.success(`Promo "${form.code.toUpperCase()}" created`);
            setForm({ ...emptyForm });
            setShowForm(false);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to create promotion');
        } finally {
            setSaving(false);
        }
    };

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
                    <p className="text-sm text-gray-500 mt-1">{store.promotions.length} promo codes</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
                >
                    <Plus className="w-4 h-4" /> New Promo
                </button>
            </div>

            {/* Create Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-gray-800">Create Promo Code</h3>
                            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Promo Code *</label>
                                    <input
                                        value={form.code}
                                        onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                        placeholder="e.g. SAVE20"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Discount % *</label>
                                    <input
                                        type="number" min="1" max="100"
                                        value={form.discountPercent}
                                        onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))}
                                        placeholder="e.g. 20"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                <input
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="e.g. 20% off all tote bags"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Max Uses</label>
                                    <input
                                        type="number" min="1"
                                        value={form.maxUsage}
                                        onChange={e => setForm(f => ({ ...f, maxUsage: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                                    <input
                                        type="date" value={form.startDate}
                                        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                                    <input
                                        type="date" value={form.endDate}
                                        onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox" checked={form.active}
                                    onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                                    className="w-4 h-4 rounded border-gray-300 text-[#F8C8DC]"
                                />
                                <span className="text-sm text-gray-700">Active immediately</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreate}
                                disabled={saving}
                                className="flex-1 py-2.5 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {saving ? 'Creating…' : 'Create Promo'}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Promotions Grid */}
            {store.promotions.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <Tag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No promo codes yet. Create your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {store.promotions.map(promo => (
                        <div key={promo.id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${promo.active ? 'border-[#F8C8DC]/30' : 'border-gray-200 opacity-70'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-[#D4A5B8]" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-gray-800">{promo.code}</span>
                                            <button onClick={() => copyCode(promo.code, promo.id)} className="p-1 hover:bg-[#F8C8DC]/10 rounded transition-colors">
                                                {copiedId === promo.id
                                                    ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                    : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500">{promo.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => togglePromo(promo.id)}>
                                        {promo.active
                                            ? <ToggleRight className="w-7 h-7 text-[#F8C8DC]" />
                                            : <ToggleLeft className="w-7 h-7 text-gray-300" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(promo.id, promo.code)}
                                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-2 bg-[#FDF8FA] rounded-xl">
                                    <p className="text-lg font-bold text-[#D4A5B8]">{promo.discountPercent}%</p>
                                    <p className="text-[10px] text-gray-500">Discount</p>
                                </div>
                                <div className="p-2 bg-[#FDF8FA] rounded-xl">
                                    <p className="text-lg font-bold text-gray-800">{promo.usageCount}/{promo.maxUsage}</p>
                                    <p className="text-[10px] text-gray-500">Usage</p>
                                </div>
                                <div className="p-2 bg-[#FDF8FA] rounded-xl">
                                    <p className="text-[11px] font-semibold text-gray-600">{new Date(promo.startDate).toLocaleDateString()}</p>
                                    <p className="text-[10px] text-gray-500">to {new Date(promo.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="h-1.5 rounded-full bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] transition-all"
                                        style={{ width: `${Math.min(100, (promo.usageCount / promo.maxUsage) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
