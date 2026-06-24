import { useState, useMemo } from 'react';
import { products } from '../data';
import { ProductCard } from '../components/ProductCard';
import { BagType, Material, Size } from '../types';
import { SlidersHorizontal, X } from 'lucide-react';

export function Shop() {
  const [selectedTypes, setSelectedTypes] = useState<BagType[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [showFilters, setShowFilters] = useState(false);

  const types: BagType[] = ['Tote', 'Clutch', 'Shoulder', 'Crossbody', 'Backpack', 'Mini'];
  const materials: Material[] = ['Leather', 'Faux Leather', 'Fabric', 'Beaded', 'Luxury'];
  const sizes: Size[] = ['Mini', 'Medium', 'Large'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(product.type);
      const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
      const sizeMatch = selectedSizes.length === 0 || product.sizes.some(s => selectedSizes.includes(s));
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return typeMatch && materialMatch && sizeMatch && priceMatch;
    });
  }, [selectedTypes, selectedMaterials, selectedSizes, priceRange]);

  const toggleFilter = <T,>(value: T, selected: T[], setter: (values: T[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setPriceRange([0, 300]);
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedMaterials.length > 0 || 
                           selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 300;

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="300"
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-[#F8C8DC]"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Type */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Bag Type</h3>
        <div className="space-y-2">
          {types.map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                className="rounded border-gray-300 text-[#F8C8DC] focus:ring-[#F8C8DC]"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Material</h3>
        <div className="space-y-2">
          {materials.map(material => (
            <label key={material} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material)}
                onChange={() => toggleFilter(material, selectedMaterials, setSelectedMaterials)}
                className="rounded border-gray-300 text-[#F8C8DC] focus:ring-[#F8C8DC]"
              />
              <span className="text-sm text-gray-700">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Size</h3>
        <div className="space-y-2">
          {sizes.map(size => (
            <label key={size} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                className="rounded border-gray-300 text-[#F8C8DC] focus:ring-[#F8C8DC]"
              />
              <span className="text-sm text-gray-700">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shop All Handbags
          </h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-[#F8C8DC]/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h2>
              </div>
              <FilterSection />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#F8C8DC]/20 hover:border-[#F8C8DC] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#F8C8DC] rounded-full"></span>
              )}
            </button>
          </div>

          {/* Mobile Filter Modal */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
              <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSection />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#FFF5F9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-10 h-10 text-[#F8C8DC]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
