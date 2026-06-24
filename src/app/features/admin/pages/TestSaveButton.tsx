import { useState } from 'react';
import { useStore } from '../../../providers/StoreProvider';
import { toast } from 'sonner';

export function TestSaveButton() {
    const store = useStore();
    const [loading, setLoading] = useState(false);

    const handleTestSave = async () => {
        console.log('=== Test Save Button Clicked ===');
        setLoading(true);
        
        try {
            console.log('Calling store.addProduct...');
            const newProduct = await store.addProduct({
                name: 'Test Handbag - ' + Date.now(),
                type: 'Tote',
                material: 'Leather',
                sizes: ['Medium'],
                colors: ['Baby Pink'],
                costPrice: 1500,
                sellingPrice: 2500,
                stock: 10,
                image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
                images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80'],
                description: 'Test product for save button verification',
                featured: false,
                newArrival: true,
                bestSeller: false,
                limitedEdition: false,
            });
            
            console.log('✅ Product created successfully:', newProduct);
            toast.success('Test product added successfully!');
            
        } catch (error: any) {
            console.error('❌ Error creating product:', error);
            toast.error(error.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Test Save Button</h1>
            <button
                onClick={handleTestSave}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Test Save Product'}
            </button>
        </div>
    );
}