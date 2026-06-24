import { useState } from 'react';
import { Upload, X, CheckCircle, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useStore } from '../../../providers/StoreProvider';

const CATEGORIES = ['Tote', 'Shoulder', 'Crossbody', 'Clutch', 'Backpack', 'Mini'] as const;
const SIZES = ['Small', 'Medium', 'Large'] as const;
const MATERIALS = ['Leather', 'Faux Leather', 'Fabric', 'Luxury'] as const;
const COLORS = [
    { name: 'Baby Pink', hex: '#F8C8DC' },
    { name: 'Blush', hex: '#E8B4C8' },
    { name: 'Rose Gold', hex: '#C9939F' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Mauve', hex: '#E0B0C8' },
    { name: 'Dusty Rose', hex: '#D4A5B8' },
    { name: 'Tan', hex: '#D2B48C' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Beige', hex: '#F5F5DC' },
];

const PLACEHOLDER = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80';

export function AddNewHandbag() {
    const navigate = useNavigate();
    const store = useStore();
    const [form, setForm] = useState({
        name: '', description: '', category: '',
        costPrice: '', sellingPrice: '', discountPrice: '',
        colors: ['Baby Pink'] as string[],
        sizes: ['Medium'] as string[],
        material: '', stock: '',
        imageUrl: '',
        featured: false, newArrival: true, bestSeller: false, limitedEdition: false,
    });
    const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successProduct, setSuccessProduct] = useState<any>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    const costPrice = parseFloat(form.costPrice) || 0;
    const sellingPrice = parseFloat(form.sellingPrice) || 0;
    const discountPrice = parseFloat(form.discountPrice) || 0;
    const profit = sellingPrice - costPrice;
    const profitMargin = sellingPrice > 0 ? ((profit / sellingPrice) * 100).toFixed(1) : '0';
    const discountPercent = sellingPrice > 0 && discountPrice > 0 && discountPrice < sellingPrice
        ? (((sellingPrice - discountPrice) / sellingPrice) * 100).toFixed(0)
        : null;
    const savings = sellingPrice > 0 && discountPrice > 0 && discountPrice < sellingPrice
        ? sellingPrice - discountPrice
        : null;

    const resolvedImage = imageTab === 'url'
        ? (form.imageUrl.trim() || PLACEHOLDER)
        : (uploadedImages[0] || PLACEHOLDER);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const toggleColor = (c: string) =>
        setForm(prev => ({
            ...prev,
            colors: prev.colors.includes(c) ? prev.colors.filter(x => x !== c) : [...prev.colors, c],
        }));

    const toggleSize = (s: string) =>
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s],
        }));

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        Array.from(e.dataTransfer.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                if (file.size > 1.5 * 1024 * 1024) {
                    toast.error(`"${file.name}" is too large. Please use an image under 1.5MB or use an image URL instead.`);
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => setUploadedImages(prev => [...prev, reader.result as string]);
                reader.readAsDataURL(file);
            }
        });
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        Array.from(e.target.files || []).forEach(file => {
            if (file.size > 1.5 * 1024 * 1024) {
                toast.error(`"${file.name}" is too large. Please use an image under 1.5MB or use an image URL instead.`);
                return;
            }
            const reader = new FileReader();
            reader.onload = () => setUploadedImages(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        setApiError(null);

        // Validate
        if (!form.name.trim()) { toast.error('Product name is required'); return; }
        if (!form.category) { toast.error('Please select a category'); return; }
        if (!form.material) { toast.error('Please select a material'); return; }
        if (!form.sellingPrice || parseFloat(form.sellingPrice) <= 0) { toast.error('Selling price is required'); return; }
        if (form.stock === '' || parseInt(form.stock) < 0) { toast.error('Stock quantity is required'); return; }

        setLoading(true);
        try {
            const payload = {
                name: form.name.trim(),
                type: form.category,
                material: form.material,
                sizes: form.sizes.length > 0 ? form.sizes : ['Medium'],
                colors: form.colors.length > 0 ? form.colors : ['Black'],
                costPrice: parseFloat(form.costPrice) || 0,
                sellingPrice: parseFloat(form.sellingPrice),
                discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
                stock: parseInt(form.stock) || 0,
                image: resolvedImage,
                images: imageTab === 'upload' ? uploadedImages : (form.imageUrl.trim() ? [form.imageUrl.trim()] : []),
                description: form.description.trim(),
                featured: form.featured,
                newArrival: form.newArrival,
                bestSeller: form.bestSeller,
                limitedEdition: form.limitedEdition,
            };

            // Use store.addProduct — hits /api/web-products via apiClient (Vite proxy)
            // and immediately updates the products list in StoreProvider state
            const newProduct = await store.addProduct({
                ...payload,
                tag: payload.newArrival ? 'New' : (payload.limitedEdition ? 'Luxury' : (payload.bestSeller ? 'Bestseller' : null)),
            } as any);

            setSuccessProduct(newProduct);
            toast.success(`✓ "${newProduct.name}" added to your store!`);

            // Reset form
            setForm({
                name: '', description: '', category: '', costPrice: '', sellingPrice: '',
                discountPrice: '', colors: ['Baby Pink'], sizes: ['Medium'], material: '',
                stock: '', imageUrl: '', featured: false, newArrival: true,
                bestSeller: false, limitedEdition: false,
            });
            setUploadedImages([]);

            // Navigate to dashboard with the new product — dashboard shows success banner
            setTimeout(() => navigate('/admin', { state: { newProduct } }), 1800);
        } catch (err: any) {
            const msg = err?.message || 'Network error — is the backend running?';
            setApiError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Success Overlay */}
            {successProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                        {/* Checkmark */}
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-9 h-9 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Product Added!</h2>
                        <p className="text-sm text-gray-500 mb-6">Now live in your store</p>

                        {/* Product card preview */}
                        <div className="bg-[#FFF5F9] rounded-2xl overflow-hidden border border-[#F8C8DC]/20 mb-6 text-left">
                            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                <img
                                    src={successProduct.image || PLACEHOLDER}
                                    alt={successProduct.name}
                                    className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                                />
                            </div>
                            <div className="p-4">
                                <p className="font-semibold text-gray-800 truncate">{successProduct.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{successProduct.type} · {successProduct.material}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[#D4A5B8] font-bold text-sm">
                                        KES {(successProduct.sellingPrice || 0).toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-400">Stock: {successProduct.stock}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400">Redirecting to products…</p>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-gray-800">Add New Handbag</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new handbag to your store.</p>
            </div>

            {/* Error banner */}
            {apiError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-700">Save failed</p>
                        <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-[#F8C8DC]/20 shadow-sm space-y-6">

                {/* Name & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Handbag Name <span className="text-red-400">*</span>
                        </label>
                        <input name="name" value={form.name} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 focus:border-[#F8C8DC] transition-all"
                            placeholder="e.g. Rosé Elegance Tote" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input name="description" value={form.description} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 focus:border-[#F8C8DC] transition-all"
                            placeholder="Brief product description" />
                    </div>
                </div>

                {/* Category, Material, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-400">*</span>
                        </label>
                        <select name="category" value={form.category} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 bg-white">
                            <option value="">Select category</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Material <span className="text-red-400">*</span>
                        </label>
                        <select name="material" value={form.material} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 bg-white">
                            <option value="">Select material</option>
                            {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity <span className="text-red-400">*</span>
                        </label>
                        <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                            placeholder="0" />
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (KES)</label>
                        <input name="costPrice" type="number" min="0" value={form.costPrice} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                            placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Selling Price (KES) <span className="text-red-400">*</span>
                        </label>
                        <input name="sellingPrice" type="number" min="0" value={form.sellingPrice} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                            placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (KES)</label>
                        <input name="discountPrice" type="number" min="0" value={form.discountPrice} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                            placeholder="Optional" />
                    </div>
                </div>

                {/* Pricing preview */}
                {(sellingPrice > 0 || discountPrice > 0) && (
                    <div className="flex flex-wrap gap-3 p-4 bg-[#FFF5F9] rounded-xl border border-[#F8C8DC]/30">
                        {sellingPrice > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Selling:</span>
                                <span className={`text-sm font-bold ${discountPercent ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                    KES {sellingPrice.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {discountPercent && discountPrice > 0 && (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">After discount:</span>
                                    <span className="text-sm font-bold text-[#D4A5B8]">KES {discountPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500 rounded-full">
                                    <span className="text-xs font-bold text-white">-{discountPercent}% OFF</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Customer saves:</span>
                                    <span className="text-sm font-semibold text-green-600">KES {savings?.toLocaleString()}</span>
                                </div>
                            </>
                        )}
                        {discountPrice > 0 && discountPrice >= sellingPrice && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-red-500 font-medium">⚠️ Discount price must be lower than selling price</span>
                            </div>
                        )}
                        {costPrice > 0 && sellingPrice > 0 && (
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-xs text-gray-500">Profit:</span>
                                <span className={`text-sm font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    KES {profit.toLocaleString()} ({profitMargin}%)
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Sizes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                    <div className="flex gap-3 flex-wrap">
                        {SIZES.map(s => (
                            <button key={s} type="button" onClick={() => toggleSize(s)}
                                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${form.sizes.includes(s)
                                    ? 'bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white border-transparent shadow-sm'
                                    : 'border-gray-200 text-gray-600 hover:border-[#F8C8DC] hover:text-[#D4A5B8]'
                                    }`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                    <div className="flex flex-wrap gap-2">
                        {COLORS.map(c => (
                            <button key={c.name} type="button" onClick={() => toggleColor(c.name)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.colors.includes(c.name)
                                    ? 'border-[#F8C8DC] bg-[#F8C8DC]/10 text-[#D4A5B8]'
                                    : 'border-gray-200 text-gray-500 hover:border-[#F8C8DC]'
                                    }`}>
                                <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image — URL or Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>

                    {/* Tab switcher */}
                    <div className="flex gap-2 mb-3">
                        <button type="button" onClick={() => setImageTab('url')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${imageTab === 'url' ? 'bg-[#F8C8DC]/20 text-[#D4A5B8] border border-[#F8C8DC]/40' : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                                }`}>
                            <LinkIcon className="w-3.5 h-3.5" /> Image URL
                        </button>
                        <button type="button" onClick={() => setImageTab('upload')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${imageTab === 'upload' ? 'bg-[#F8C8DC]/20 text-[#D4A5B8] border border-[#F8C8DC]/40' : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                                }`}>
                            <Upload className="w-3.5 h-3.5" /> Upload File
                        </button>
                    </div>

                    {imageTab === 'url' ? (
                        <div className="flex gap-3 items-start">
                            <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40 focus:border-[#F8C8DC] transition-all"
                                placeholder="https://images.unsplash.com/... or any image URL" />
                            {form.imageUrl && (
                                <img src={form.imageUrl} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
                            )}
                        </div>
                    ) : (
                        <>
                            <div
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload')?.click()}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-[#F8C8DC] bg-[#F8C8DC]/5' : 'border-gray-200 hover:border-[#F8C8DC]/50'
                                    }`}>
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Drag & drop or <span className="text-[#D4A5B8] font-medium">browse</span></p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                <input id="file-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
                            </div>
                            {uploadedImages.length > 0 && (
                                <div className="flex gap-3 mt-3 flex-wrap">
                                    {uploadedImages.map((img, i) => (
                                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => setUploadedImages(prev => prev.filter((_, j) => j !== i))}
                                                className="absolute top-1 right-1 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center">
                                                <X className="w-3 h-3 text-gray-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                        If no image is provided, a default placeholder will be used.
                    </p>
                </div>

                {/* Flags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Flags</label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { name: 'featured', label: 'Featured' },
                            { name: 'newArrival', label: 'New Arrival' },
                            { name: 'bestSeller', label: 'Best Seller' },
                            { name: 'limitedEdition', label: 'Limited Edition' },
                        ].map(flag => (
                            <label key={flag.name} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name={flag.name}
                                    checked={(form as any)[flag.name]}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-[#F8C8DC] focus:ring-[#F8C8DC]" />
                                <span className="text-sm text-gray-700">{flag.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Save button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                    <button type="button" onClick={handleSave} disabled={loading}
                        className="sm:ml-auto w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving…
                            </>
                        ) : 'Save Handbag'}
                    </button>
                </div>
            </div>
        </div>
    );
}
