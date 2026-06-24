import { products } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Star, Sparkles } from 'lucide-react';

export function LimitedEdition() {
  const limitedProducts = products.filter(p => p.limitedEdition);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-2 rounded-full mb-4 shadow-md">
            <Star className="w-4 h-4 mr-2 fill-white" />
            <span className="text-sm font-medium">Exclusive</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Limited Edition Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rare designs in limited quantities. Once they're gone, they're gone forever.
            Don't miss your chance to own something truly special.
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#F8C8DC]/20 to-[#D4A5B8]/20 rounded-2xl p-6 mb-12 border border-[#F8C8DC]/30">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
            <Sparkles className="w-4 h-4 text-[#F8C8DC]" />
            <span>Each limited edition piece comes with a certificate of authenticity</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {limitedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {limitedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600">
              No limited edition items available. Check back soon for exclusive releases!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
