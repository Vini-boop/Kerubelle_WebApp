import { products } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Sparkles } from 'lucide-react';

export function NewArrivals() {
  const newProducts = products.filter(p => p.newArrival);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#F8C8DC] mr-2" />
            <span className="text-sm text-gray-700">Just Landed</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest additions to our collection. Fresh styles that are already
            turning heads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {newProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600">No new arrivals at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
