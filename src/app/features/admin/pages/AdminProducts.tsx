import { useState } from 'react';
import { useStore } from '../../../providers/StoreProvider';
import { Product } from '../../../shared/types/types';
import { Search, Trash2, Edit2, Eye, Package, CheckCircle, X, Tag, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const CATEGORIES = ['Tote', 'Shoulder', 'Crossbody', 'Clutch', 'Backpack', 'Mini'];
const MATERIALS = ['Leather', 'Faux Leather', 'Fabric', 'Luxury'];
const PLACEHOLDER = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80';

export function AdminProducts() {
    const store = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);
    const [successProduct, setSuccessProduct] = useState<any>(null);

    // Edit state
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    const openEdit = (p: Product) => {
        setEditingProduct(p);
        setEditForm({
            name: p.name || '',
            type: p.type || '',
            material: p.material || '',
            costPrice: String(p.costPrice || ''),
            sellingPrice: String(p.sellingPrice || ''),
            discountPrice: p.discountPrice ? String(p.discountPrice) : '',
            stock: String(p.stock || ''),
            image: p.image || '',
            description: p.description || '',
            featured: !!p.featured,
            newArrival: !!p.newArrival,
            bestSeller: !!p.bestSeller,
            limitedEdition: !!p.limitedEdition,
        });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setEditForm((s: any) => ({
            ...s,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    // Live discount calc
    const sellingPrice = parseFloat(editForm.sellingPrice) || 0;
    const discountPrice = parseFloat(editForm.discountPrice) || 0;
    const costPrice = parseFloat(editForm.costPrice) || 0;
    const hasValidDiscount = discountPrice > 0 && discountPrice < sellingPrice;
    const savings = hasValidDiscount ? sellingPrice - discountPrice : 0;
    const discountPct = hasValidDiscount ? Math.round((savings / sellingPrice) * 100) : 0;
    const profit = sellingPrice - costPrice;
    const profitMargin = sellingPrice > 0 ? ((profit / sellingPrice) * 100).toFixed(1) : '0';

    const handleSaveEdit = async () => {
        if (!editingProduct) return;
        if (!editForm.name?.trim()) { toast.error('Product name is required'); return; }
        if (!editForm.sellingPrice || sellingPrice <= 0) { toast.error('Selling price is required'); return; }
        if (discountPrice > 0 && discountPrice >= sellingPrice) {
            toast.error('Discount price must be less than selling price'); return;
        }

        setSaving(true);
        try {
            const updates: any = {
                name: editForm.name.trim(),
                type: editForm.type,
                material: editForm.material,
                sizes: editingProduct.sizes || ['Small', 'Medium', 'Large'],
                colors: editingProduct.colors || ['Black', 'Brown'],
                costPrice: parseFloat(editForm.costPrice) || 0,
                sellingPrice: parseFloat(editForm.sellingPrice),
                discountPrice: editForm.discountPrice ? parseFloat(editForm.discountPrice) : null,
                stock: parseInt(editForm.stock) || 0,
                image: editForm.image || editingProduct.image,
                images: editingProduct.images || [],
                description: editForm.description.trim(),
                featured: !!editForm.featured,
                newArrival: !!editForm.newArrival,
                bestSeller: !!editForm.bestSeller,
                limitedEdition: !!editForm.limitedEdition,
                // Auto-set tag based on flags
                tag: editForm.newArrival ? 'New' : editForm.limitedEdition ? 'Luxury' : editForm.bestSeller ? 'Bestseller' : null,
            };

            await store.updateProduct(editingProduct.id, updates);
            setEditingProduct(null);
            setSuccessProduct(updates);
            // Auto-dismiss after 4 seconds
            setTimeout(() => setSuccessProduct(null), 4000);
            toast.success(`✅ "${updates.name}" updated successfully`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    const filtered = store.products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await store.deleteProduct(id);
            toast.success(`✅ "${name}" deleted`);
        } catch (err: any) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">{store.products.length} products total</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 w-64"
                        />
                    </div>
                    <Link to="/admin/add-product" className="px-5 py-2.5 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                        <Package className="w-4 h-4" /> Add Product
                    </Link>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(product => {
                    const hasDiscount = product.discountPrice && product.discountPrice < product.sellingPrice;
                    const displayPrice = hasDiscount ? product.discountPrice! : product.sellingPrice;
                    const savingsAmt = hasDiscount ? product.sellingPrice - product.discountPrice! : 0;
                    const discPct = hasDiscount ? Math.round((savingsAmt / product.sellingPrice) * 100) : 0;
                    const profitPct = product.costPrice > 0 ? Math.round(((product.sellingPrice - product.costPrice) / product.costPrice) * 100) : 0;

                    return (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-[#F8C8DC]/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                <img src={product.image || PLACEHOLDER} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {hasDiscount && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">-{discPct}%</span>
                                    )}
                                    {product.newArrival && <span className="bg-[#F8C8DC] text-white text-xs px-2 py-0.5 rounded-full">New</span>}
                                    {product.bestSeller && <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">Best Seller</span>}
                                </div>
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                    {product.stock === 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Out of Stock</span>}
                                    {product.stock > 0 && product.stock <= 5 && <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">Low Stock</span>}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{product.type} · {product.material}</p>

                                {/* Price section */}
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#D4A5B8] font-bold">KES {(displayPrice || 0).toLocaleString()}</span>
                                        {hasDiscount && (
                                            <span className="text-xs text-gray-400 line-through">KES {product.sellingPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                    {hasDiscount && (
                                        <span className="inline-block mt-0.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                            Save KES {savingsAmt.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500">Cost: KES {(product.costPrice || 0).toLocaleString()}</span>
                                    <span className={`text-xs font-medium ${profitPct > 30 ? 'text-green-600' : 'text-amber-600'}`}>
                                        Profit: {profitPct}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                                    <span>Stock: {product.stock}</span>
                                    <span>Sales: {product.salesCount}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link to={`/product/${product.id}`} className="flex-1 text-center py-2 px-3 text-xs border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                                        <Eye className="w-3.5 h-3.5 inline mr-1" /> View
                                    </Link>
                                    <button onClick={() => openEdit(product)} className="flex-1 text-center py-2 px-3 text-xs border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                                        <Edit2 className="w-3.5 h-3.5 inline mr-1" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(product.id, product.name)} className="flex-1 text-center py-2 px-3 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-all">
                                        <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Success overlay after edit ── */}
            {successProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
                        {/* Animated checkmark */}
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">Product Updated!</h2>
                        <p className="text-sm text-gray-500 mb-6">Your changes are now live in your store</p>

                        {/* Product preview card */}
                        <div className="bg-[#FFF5F9] rounded-2xl overflow-hidden border border-[#F8C8DC]/20 mb-5 text-left">
                            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                <img
                                    src={successProduct.image || PLACEHOLDER}
                                    alt={successProduct.name}
                                    className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                                />
                            </div>
                            <div className="p-4 space-y-1">
                                <p className="font-bold text-gray-900 truncate">{successProduct.name}</p>
                                <p className="text-xs text-gray-400">{successProduct.type} · {successProduct.material}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[#D4A5B8] font-bold text-sm">
                                        KES {(successProduct.discountPrice || successProduct.sellingPrice || 0).toLocaleString()}
                                    </span>
                                    {successProduct.discountPrice && successProduct.discountPrice < successProduct.sellingPrice && (
                                        <>
                                            <span className="text-xs text-gray-400 line-through">KES {(successProduct.sellingPrice || 0).toLocaleString()}</span>
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                Save KES {(successProduct.sellingPrice - successProduct.discountPrice).toLocaleString()}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {successProduct.newArrival && <span className="text-[10px] bg-[#F8C8DC]/20 text-[#D4A5B8] px-2 py-0.5 rounded-full font-semibold">🆕 New Arrival</span>}
                                    {successProduct.featured && <span className="text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-semibold">⭐ Featured</span>}
                                    {successProduct.bestSeller && <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-semibold">🔥 Best Seller</span>}
                                    {successProduct.limitedEdition && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">💎 Limited</span>}
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Stock: {successProduct.stock}</span>
                                    <span>Cost: KES {(successProduct.costPrice || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSuccessProduct(null)}
                            className="w-full py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Done
                        </button>
                        <p className="text-xs text-gray-400 mt-3">Auto-closes in a few seconds…</p>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img src={editForm.image || PLACEHOLDER} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Edit Product</h3>
                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{editingProduct.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Name & Description */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name <span className="text-red-400">*</span></label>
                                    <input name="name" value={editForm.name} onChange={handleEditChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 focus:border-[#F8C8DC] transition-all"
                                        placeholder="Product name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                    <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={2}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 focus:border-[#F8C8DC] transition-all resize-none"
                                        placeholder="Product description" />
                                </div>
                            </div>

                            {/* Category, Material, Stock */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                    <select name="type" value={editForm.type} onChange={handleEditChange}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 bg-white">
                                        <option value="">Select</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Material</label>
                                    <select name="material" value={editForm.material} onChange={handleEditChange}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 bg-white">
                                        <option value="">Select</option>
                                        {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock</label>
                                    <input name="stock" type="number" min="0" value={editForm.stock} onChange={handleEditChange}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40" />
                                </div>
                            </div>

                            {/* Pricing */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Pricing (KES)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Cost Price</label>
                                        <input name="costPrice" type="number" min="0" value={editForm.costPrice} onChange={handleEditChange}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40" placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Selling Price <span className="text-red-400">*</span></label>
                                        <input name="sellingPrice" type="number" min="0" value={editForm.sellingPrice} onChange={handleEditChange}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40" placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Discount Price</label>
                                        <input name="discountPrice" type="number" min="0" value={editForm.discountPrice} onChange={handleEditChange}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40" placeholder="Optional" />
                                    </div>
                                </div>

                                {/* Live pricing preview */}
                                {sellingPrice > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-3 p-3 bg-[#FFF5F9] rounded-xl border border-[#F8C8DC]/30 text-sm">
                                        {hasValidDiscount ? (
                                            <>
                                                <span className="text-gray-500 line-through">KES {sellingPrice.toLocaleString()}</span>
                                                <span className="font-bold text-[#D4A5B8]">KES {discountPrice.toLocaleString()}</span>
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discountPct}% OFF</span>
                                                <span className="text-green-600 font-semibold">Save KES {savings.toLocaleString()}</span>
                                            </>
                                        ) : discountPrice >= sellingPrice && discountPrice > 0 ? (
                                            <span className="flex items-center gap-1 text-red-500 text-xs">
                                                <AlertTriangle className="w-3.5 h-3.5" /> Discount must be less than selling price
                                            </span>
                                        ) : null}
                                        {costPrice > 0 && (
                                            <span className="ml-auto text-gray-600 font-medium">
                                                Profit: KES {profit.toLocaleString()} <span className={profit >= 0 ? 'text-green-600' : 'text-red-500'}>({profitMargin}%)</span>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
                                <div className="flex gap-3 items-center">
                                    <input name="image" value={editForm.image} onChange={handleEditChange}
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 focus:border-[#F8C8DC] transition-all"
                                        placeholder="https://..." />
                                    {editForm.image && (
                                        <img src={editForm.image} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                                            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
                                    )}
                                </div>
                            </div>

                            {/* Flags */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-1" /> Product Flags
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { name: 'featured', label: '⭐ Featured' },
                                        { name: 'newArrival', label: '🆕 New Arrival' },
                                        { name: 'bestSeller', label: '🔥 Best Seller' },
                                        { name: 'limitedEdition', label: '💎 Limited' },
                                    ].map(flag => (
                                        <label key={flag.name} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${(editForm as any)[flag.name] ? 'border-[#F8C8DC] bg-[#FFF5F9] text-[#D4A5B8]' : 'border-gray-200 text-gray-600 hover:border-[#F8C8DC]/50'}`}>
                                            <input type="checkbox" name={flag.name} checked={(editForm as any)[flag.name]} onChange={handleEditChange}
                                                className="w-4 h-4 accent-[#F8C8DC]" />
                                            <span className="text-xs font-medium">{flag.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 pt-0">
                            <button onClick={() => setEditingProduct(null)}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSaveEdit} disabled={saving}
                                className="px-8 py-2.5 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2">
                                {saving ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                                ) : (
                                    <><CheckCircle className="w-4 h-4" /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No products found</p>
                </div>
            )}
        </div>
    );
}
